import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RoomService } from '../../core/services/room.service';
import { HostelService } from '../../core/services/hostel.service';
import { NotificationService } from '../../core/services/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Room, Hostel } from '../../core/models';

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Rooms</h1>
          <p class="page-subtitle">Manage room capacity, occupancy, and available beds</p>
        </div>
        <div class="header-actions">
          <button
            type="button"
            class="btn"
            [ngClass]="isAboveAverageMode ? 'btn-primary' : 'btn-outline-primary'"
            (click)="toggleAboveAverage()"
          >
            <i class="fa-solid fa-arrow-trend-up"></i>
            <span>{{ isAboveAverageMode ? 'Show All Rooms' : 'Show Above Average Occupancy' }}</span>
          </button>
          <button type="button" class="btn btn-primary" (click)="openAddModal()">
            <i class="fa-solid fa-plus"></i>
            <span>Add Room</span>
          </button>
        </div>
      </div>

      <!-- Subquery Active Notice -->
      <div *ngIf="isAboveAverageMode" class="info-banner">
        <i class="fa-solid fa-circle-info"></i>
        <span>
          Showing rooms with occupancy above the campus average (queried via backend subquery <code>GET /api/rooms/above-average</code>).
        </span>
      </div>

      <!-- Search & Count Bar -->
      <div class="card filter-card">
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              class="form-control"
              placeholder="Search by room number or ID..."
              [value]="searchTerm"
              (input)="onSearchChange($event)"
            />
          </div>
          <div class="filter-count">
            Total Rooms: <strong>{{ filteredRooms.length }}</strong>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner spinner-primary"></div>
        <span>Loading rooms...</span>
      </div>

      <!-- Rooms Table -->
      <div *ngIf="!isLoading" class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Room ID</th>
                <th>Hostel</th>
                <th>Room Number</th>
                <th>Capacity</th>
                <th>Occupancy</th>
                <th>Available Beds</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let room of filteredRooms">
                <td>#{{ room.roomId }}</td>
                <td>{{ getHostelName(room.hostelId) }}</td>
                <td><strong>Room {{ room.roomNumber }}</strong></td>
                <td>{{ room.capacity }} beds</td>
                <td>
                  <span class="badge" [ngClass]="room.occupancy > 0 ? 'badge-primary' : 'badge-neutral'">
                    {{ room.occupancy }} occupied
                  </span>
                </td>
                <td>
                  <span
                    class="badge"
                    [ngClass]="(room.capacity - room.occupancy) > 0 ? 'badge-success' : 'badge-danger'"
                  >
                    {{ (room.capacity - room.occupancy) }} available
                  </span>
                </td>
                <td style="text-align: right;">
                  <button
                    type="button"
                    class="btn btn-outline btn-icon btn-sm"
                    title="Edit Room"
                    (click)="openEditModal(room)"
                    style="margin-right: 6px;"
                  >
                    <i class="fa-regular fa-pen-to-square"></i>
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger btn-icon btn-sm"
                    title="Delete Room"
                    (click)="openDeleteConfirm(room)"
                  >
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredRooms.length === 0">
                <td colspan="7" class="empty-cell">
                  {{ isAboveAverageMode ? 'No rooms exceed average occupancy.' : 'No rooms found.' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add / Edit Modal -->
      <div class="modal-backdrop" *ngIf="isFormModalOpen" (click)="closeFormModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">{{ isEditMode ? 'Edit Room' : 'Add New Room' }}</h3>
            <button type="button" class="modal-close-btn" (click)="closeFormModal()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form [formGroup]="roomForm" (ngSubmit)="saveRoom()">
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="roomId">Room ID <span class="required">*</span></label>
                  <input
                    id="roomId"
                    type="number"
                    class="form-control"
                    formControlName="roomId"
                    placeholder="e.g. 201"
                    [class.is-invalid]="isFieldInvalid('roomId')"
                  />
                  <div *ngIf="isFieldInvalid('roomId')" class="form-error">Room ID is required.</div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="roomNumber">Room Number <span class="required">*</span></label>
                  <input
                    id="roomNumber"
                    type="text"
                    class="form-control"
                    formControlName="roomNumber"
                    placeholder="e.g. 101"
                    [class.is-invalid]="isFieldInvalid('roomNumber')"
                  />
                  <div *ngIf="isFieldInvalid('roomNumber')" class="form-error">Room number is required.</div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="hostelId">Hostel <span class="required">*</span></label>
                <select
                  id="hostelId"
                  class="form-select"
                  formControlName="hostelId"
                  [class.is-invalid]="isFieldInvalid('hostelId')"
                >
                  <option [ngValue]="null" disabled>Select hostel...</option>
                  <option *ngFor="let h of hostels" [ngValue]="h.hostelId">
                    {{ h.hostelName }} (ID: {{ h.hostelId }})
                  </option>
                </select>
                <div *ngIf="isFieldInvalid('hostelId')" class="form-error">Please select a hostel.</div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="capacity">Capacity (Beds) <span class="required">*</span></label>
                  <input
                    id="capacity"
                    type="number"
                    min="1"
                    class="form-control"
                    formControlName="capacity"
                    placeholder="e.g. 2"
                    [class.is-invalid]="isFieldInvalid('capacity')"
                  />
                  <div *ngIf="isFieldInvalid('capacity')" class="form-error">Capacity must be at least 1.</div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="occupancy">Occupancy</label>
                  <input
                    id="occupancy"
                    type="number"
                    min="0"
                    class="form-control"
                    formControlName="occupancy"
                    placeholder="0"
                  />
                  <span class="form-hint">Updated automatically by database trigger upon room allocation.</span>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeFormModal()">Cancel</button>
              <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                <span>{{ isEditMode ? 'Save Changes' : 'Create Room' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-backdrop" *ngIf="roomToDelete" (click)="roomToDelete = null">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title text-danger">Confirm Delete Room</h3>
            <button type="button" class="modal-close-btn" (click)="roomToDelete = null">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>Are you sure you want to delete <strong>Room {{ roomToDelete.roomNumber }}</strong> (ID: #{{ roomToDelete.roomId }})?</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="roomToDelete = null">Cancel</button>
            <button type="button" class="btn btn-danger" (click)="confirmDelete()" [disabled]="isSubmitting">
              <span>Delete</span>
            </button>
          </div>
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

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .info-banner {
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
      padding: 10px 14px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.85rem;
    }

    .info-banner code {
      font-family: monospace;
      background: #ffffff;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .filter-card {
      padding: 12px 18px;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      max-width: 360px;
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

    .empty-cell {
      text-align: center;
      padding: 32px !important;
      color: var(--slate-400, #94a3b8);
    }
  `]
})
export class RoomsComponent implements OnInit {
  private roomService = inject(RoomService);
  private hostelService = inject(HostelService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  rooms: Room[] = [];
  hostels: Hostel[] = [];
  filteredRooms: Room[] = [];
  isLoading = true;
  searchTerm = '';
  isAboveAverageMode = false;

  isFormModalOpen = false;
  isEditMode = false;
  isSubmitting = false;
  roomToDelete: Room | null = null;

  roomForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.roomForm = this.fb.group({
      roomId: [null, [Validators.required, Validators.min(1)]],
      hostelId: [null, [Validators.required]],
      roomNumber: ['', [Validators.required]],
      capacity: [2, [Validators.required, Validators.min(1)]],
      occupancy: [0, [Validators.min(0)]]
    });
  }

  loadData(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.hostelService.getAll().subscribe({
      next: (hostels) => {
        this.hostels = hostels || [];
        this.cdr.markForCheck();
        this.fetchRooms();
      },
      error: () => this.fetchRooms()
    });
  }

  fetchRooms(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    if (this.isAboveAverageMode) {
      this.roomService.getAboveAverage().subscribe({
        next: (data) => {
          this.rooms = data || [];
          this.applyFilter();
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorHandler.handleError(err, 'Failed to Load Rooms');
          this.cdr.markForCheck();
        }
      });
    } else {
      this.roomService.getAll().subscribe({
        next: (data) => {
          this.rooms = data || [];
          this.applyFilter();
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorHandler.handleError(err, 'Failed to Load Rooms');
          this.cdr.markForCheck();
        }
      });
    }
  }

  toggleAboveAverage(): void {
    this.isAboveAverageMode = !this.isAboveAverageMode;
    this.fetchRooms();
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredRooms = [...this.rooms];
      return;
    }
    const q = this.searchTerm.toLowerCase().trim();
    this.filteredRooms = this.rooms.filter(r =>
      r.roomId.toString().includes(q) ||
      r.roomNumber.toLowerCase().includes(q) ||
      this.getHostelName(r.hostelId).toLowerCase().includes(q)
    );
  }

  getHostelName(hostelId: number): string {
    const h = this.hostels.find(x => x.hostelId === hostelId);
    return h ? h.hostelName : `Hostel #${hostelId}`;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.roomForm.reset({ capacity: 2, occupancy: 0, hostelId: null });
    this.roomForm.get('roomId')?.enable();
    this.isFormModalOpen = true;
  }

  openEditModal(room: Room): void {
    this.isEditMode = true;
    this.roomForm.patchValue({
      roomId: room.roomId,
      hostelId: room.hostelId,
      roomNumber: room.roomNumber,
      capacity: room.capacity,
      occupancy: room.occupancy
    });
    this.roomForm.get('roomId')?.disable();
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.isSubmitting = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.roomForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  saveRoom(): void {
    if (this.roomForm.invalid) {
      this.roomForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const rawValue = this.roomForm.getRawValue() as Room;

    if (this.isEditMode) {
      this.roomService.update(rawValue.roomId, rawValue).subscribe({
        next: (updated) => {
          this.isSubmitting = false;
          this.closeFormModal();
          this.notification.success(`Room ${updated.roomNumber} updated successfully.`);
          this.fetchRooms();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorHandler.handleError(err, 'Failed to Update Room');
          this.cdr.markForCheck();
        }
      });
    } else {
      this.roomService.create(rawValue).subscribe({
        next: (created) => {
          this.isSubmitting = false;
          this.closeFormModal();
          this.notification.success(`Room ${created.roomNumber} created successfully.`);
          this.fetchRooms();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorHandler.handleError(err, 'Failed to Create Room');
          this.cdr.markForCheck();
        }
      });
    }
  }

  openDeleteConfirm(room: Room): void {
    this.roomToDelete = room;
  }

  confirmDelete(): void {
    if (!this.roomToDelete) return;
    this.isSubmitting = true;
    const id = this.roomToDelete.roomId;
    const num = this.roomToDelete.roomNumber;

    this.roomService.delete(id).subscribe({
      next: (msg) => {
        this.isSubmitting = false;
        this.roomToDelete = null;
        this.notification.success(msg || `Room ${num} deleted successfully.`);
        this.fetchRooms();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorHandler.handleError(err, 'Failed to Delete Room');
        this.cdr.markForCheck();
      }
    });
  }
}
