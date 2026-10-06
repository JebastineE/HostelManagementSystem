import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { StudentService } from '../../core/services/student.service';
import { HostelService } from '../../core/services/hostel.service';
import { RoomService } from '../../core/services/room.service';
import { AllocationService } from '../../core/services/allocation.service';
import { StudentRoomAllocation } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="page-header">
        <div>
          <h1 class="page-title">Dashboard</h1>
          <p class="page-subtitle">Overview of hostel system records and active bed allocations</p>
        </div>
        <button type="button" class="btn btn-outline btn-sm" (click)="loadDashboard()" [disabled]="isLoading">
          <i class="fa-solid fa-arrows-rotate" [class.fa-spin]="isLoading"></i> Refresh
        </button>
      </div>

      <!-- Simple Error Banner if Backend is down -->
      <div *ngIf="errorMessage" class="error-banner">
        <i class="fa-solid fa-circle-exclamation"></i>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Loading Indicator -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner spinner-primary"></div>
        <span>Loading dashboard summary...</span>
      </div>

      <div *ngIf="!isLoading">
        <!-- 4 Simple Stat Cards -->
        <div class="stats-row">
          <div class="stat-card">
            <div class="stat-icon icon-students"><i class="fa-solid fa-user-graduate"></i></div>
            <div class="stat-info">
              <span class="stat-label">Total Students</span>
              <strong class="stat-value">{{ totalStudents }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon icon-hostels"><i class="fa-solid fa-hotel"></i></div>
            <div class="stat-info">
              <span class="stat-label">Total Hostels</span>
              <strong class="stat-value">{{ totalHostels }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon icon-rooms"><i class="fa-solid fa-bed"></i></div>
            <div class="stat-info">
              <span class="stat-label">Total Rooms</span>
              <strong class="stat-value">{{ totalRooms }}</strong>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon icon-allocations"><i class="fa-solid fa-clipboard-check"></i></div>
            <div class="stat-info">
              <span class="stat-label">Total Allocations</span>
              <strong class="stat-value">{{ totalAllocations }}</strong>
            </div>
          </div>
        </div>

        <!-- Recent Allocations Table -->
        <div class="card recent-card">
          <div class="card-header">
            <h2 class="card-title">Recent Allocations</h2>
            <a routerLink="/allocations" class="btn btn-outline btn-sm">View All Allocations</a>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Allocation ID</th>
                  <th>Student Name</th>
                  <th>Course</th>
                  <th>Hostel</th>
                  <th>Room</th>
                  <th>Allocated Date</th>
                  <th>Duration</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of recentAllocations">
                  <td>#{{ item.allocationId }}</td>
                  <td><strong>{{ item.studentName }}</strong></td>
                  <td>{{ item.course }}</td>
                  <td>{{ item.hostelName }}</td>
                  <td>Room {{ item.roomNumber }}</td>
                  <td>{{ item.allocatedDate }}</td>
                  <td>{{ item.durationMonths }} Month(s)</td>
                </tr>
                <tr *ngIf="recentAllocations.length === 0">
                  <td colspan="7" class="empty-cell">
                    No room allocations recorded yet.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
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

    .error-banner {
      background-color: #fef2f2;
      border: 1px solid #fee2e2;
      color: #b91c1c;
      padding: 12px 16px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 0.88rem;
    }

    .loading-state {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 32px;
      color: var(--slate-500, #64748b);
      font-size: 0.9rem;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
    }

    .stat-card {
      background: #ffffff;
      border: 1px solid var(--slate-200, #e2e8f0);
      border-radius: 10px;
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    }

    .stat-icon {
      width: 48px;
      height: 48px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.3rem;
      flex-shrink: 0;
    }

    .icon-students { background: #eff6ff; color: #2563eb; }
    .icon-hostels { background: #fdf2f8; color: #db2777; }
    .icon-rooms { background: #f0fdf4; color: #16a34a; }
    .icon-allocations { background: #faf5ff; color: #9333ea; }

    .stat-info {
      display: flex;
      flex-direction: column;
    }

    .stat-label {
      font-size: 0.8rem;
      color: var(--slate-500, #64748b);
      font-weight: 500;
    }

    .stat-value {
      font-family: var(--font-display, sans-serif);
      font-size: 1.7rem;
      font-weight: 700;
      color: var(--slate-900, #0f172a);
      line-height: 1.1;
      margin-top: 2px;
    }

    .recent-card {
      margin-top: 10px;
    }

    .card-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--slate-100, #f1f5f9);
    }

    .card-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--slate-900, #0f172a);
    }

    .empty-cell {
      text-align: center;
      padding: 32px !important;
      color: var(--slate-400, #94a3b8);
    }
  `]
})
export class DashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private hostelService = inject(HostelService);
  private roomService = inject(RoomService);
  private allocationService = inject(AllocationService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = true;
  errorMessage = '';

  totalStudents = 0;
  totalHostels = 0;
  totalRooms = 0;
  totalAllocations = 0;
  recentAllocations: StudentRoomAllocation[] = [];

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    forkJoin({
      students: this.studentService.getAll().pipe(catchError(() => of(null))),
      hostels: this.hostelService.getAll().pipe(catchError(() => of(null))),
      rooms: this.roomService.getAll().pipe(catchError(() => of(null))),
      allocations: this.allocationService.getAll().pipe(catchError(() => of(null))),
      joinedAllocations: this.allocationService.getStudentRoomAllocations().pipe(catchError(() => of(null)))
    }).subscribe({
      next: ({ students, hostels, rooms, allocations, joinedAllocations }) => {
        this.isLoading = false;

        if (students === null && hostels === null && rooms === null && allocations === null) {
          this.errorMessage = 'Unable to reach backend at http://localhost:8081. Please ensure Spring Boot is running.';
          this.cdr.markForCheck();
          return;
        }

        this.totalStudents = students ? students.length : 0;
        this.totalHostels = hostels ? hostels.length : 0;
        this.totalRooms = rooms ? rooms.length : 0;
        this.totalAllocations = allocations ? allocations.length : 0;
        this.recentAllocations = joinedAllocations ? joinedAllocations.slice(-5).reverse() : [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'An error occurred while loading dashboard metrics.';
        this.cdr.markForCheck();
      }
    });
  }
}

