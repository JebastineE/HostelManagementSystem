import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditService } from '../../core/services/audit.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuditLog } from '../../core/models';

@Component({
  selector: 'app-activity-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Activity Log</h1>
          <p class="page-subtitle">Track database operations, records changed, and update timestamps</p>
        </div>
        <button type="button" class="btn btn-outline btn-sm" (click)="loadLogs()" [disabled]="isLoading">
          <i class="fa-solid fa-arrows-rotate" [class.fa-spin]="isLoading"></i> Refresh
        </button>
      </div>

      <!-- Search & Filters -->
      <div class="card filter-card">
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              class="form-control"
              placeholder="Search by action, table, record ID, or text..."
              [value]="searchTerm"
              (input)="onSearchChange($event)"
            />
          </div>

          <div class="filter-actions">
            <select class="form-select action-select" [value]="actionFilter" (change)="onActionFilterChange($event)">
              <option value="ALL">All Actions</option>
              <option value="INSERT">INSERT</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
            </select>
            <div class="filter-count">
              Total Logs: <strong>{{ filteredLogs.length }}</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner spinner-primary"></div>
        <span>Loading activity logs...</span>
      </div>

      <!-- Simple Activity Table -->
      <div *ngIf="!isLoading" class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Audit ID</th>
                <th>Action</th>
                <th>Table Name</th>
                <th>Record ID</th>
                <th>Old Value</th>
                <th>New Value</th>
                <th>Changed At</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of filteredLogs">
                <td>#{{ log.auditId }}</td>
                <td>
                  <span class="badge" [ngClass]="getActionBadgeClass(log.action)">
                    {{ log.action }}
                  </span>
                </td>
                <td>
                  <code>{{ log.tableName }}</code>
                </td>
                <td><strong>#{{ log.recordId }}</strong></td>
                <td class="log-val-cell">
                  <span *ngIf="log.oldValue">{{ log.oldValue }}</span>
                  <span *ngIf="!log.oldValue" class="text-muted">—</span>
                </td>
                <td class="log-val-cell">
                  <span *ngIf="log.newValue">{{ log.newValue }}</span>
                  <span *ngIf="!log.newValue" class="text-muted">—</span>
                </td>
                <td>{{ formatTimestamp(log.changedAt) }}</td>
              </tr>
              <tr *ngIf="filteredLogs.length === 0">
                <td colspan="7" class="empty-cell">
                  No activity logs found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .page-title {
      font-size: 1.45rem;
      font-weight: 700;
      color: var(--slate-900, #0f172a);
    }

    .page-subtitle {
      font-size: 0.85rem;
      color: var(--slate-500, #64748b);
      margin-top: 2px;
    }

    .filter-card {
      padding: 12px 18px;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 14px;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      max-width: 380px;
    }

    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--slate-400, #94a3b8);
      font-size: 0.85rem;
    }

    .search-input-wrapper input {
      padding-left: 34px;
    }

    .filter-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .action-select {
      width: auto;
      padding: 6px 12px;
      font-size: 0.85rem;
    }

    .filter-count {
      font-size: 0.85rem;
      color: var(--slate-500, #64748b);
    }

    .loading-state {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 32px;
      color: var(--slate-500, #64748b);
      font-size: 0.9rem;
    }

    .log-val-cell {
      max-width: 250px;
      font-family: monospace;
      font-size: 0.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .text-muted {
      color: var(--slate-400, #94a3b8);
    }

    code {
      background: var(--slate-100, #f1f5f9);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.82rem;
    }

    .empty-cell {
      text-align: center;
      padding: 32px !important;
      color: var(--slate-400, #94a3b8);
    }
  `]
})
export class ActivityLogComponent implements OnInit {
  private auditService = inject(AuditService);
  private errorHandler = inject(ErrorHandlerService);
  private cdr = inject(ChangeDetectorRef);

  logs: AuditLog[] = [];
  filteredLogs: AuditLog[] = [];
  isLoading = true;
  searchTerm = '';
  actionFilter = 'ALL';

  ngOnInit(): void {
    this.loadLogs();
  }

  loadLogs(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.auditService.getAll().subscribe({
      next: (data) => {
        this.logs = (data || []).reverse();
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorHandler.handleError(err, 'Failed to Load Activity Logs');
        this.cdr.markForCheck();
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilter();
  }

  onActionFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.actionFilter = select.value;
    this.applyFilter();
  }

  private applyFilter(): void {
    let result = [...this.logs];

    if (this.actionFilter !== 'ALL') {
      result = result.filter(l => (l.action || '').toUpperCase() === this.actionFilter);
    }

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase().trim();
      result = result.filter(l =>
        l.auditId.toString().includes(q) ||
        l.tableName.toLowerCase().includes(q) ||
        (l.action && l.action.toLowerCase().includes(q)) ||
        (l.oldValue && l.oldValue.toLowerCase().includes(q)) ||
        (l.newValue && l.newValue.toLowerCase().includes(q))
      );
    }

    this.filteredLogs = result;
  }

  getActionBadgeClass(action: string): string {
    const a = (action || '').toUpperCase();
    if (a.includes('INSERT')) return 'badge-success';
    if (a.includes('UPDATE')) return 'badge-warning';
    if (a.includes('DELETE')) return 'badge-danger';
    return 'badge-neutral';
  }

  formatTimestamp(dateStr: string): string {
    if (!dateStr) return '';
    return dateStr.replace('T', ' ').substring(0, 19);
  }
}
