import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AllocationService } from '../../core/services/allocation.service';
import { StudentService } from '../../core/services/student.service';
import { RoomService } from '../../core/services/room.service';
import { NotificationService } from '../../core/services/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { StudentRoomAllocation, Student, Room } from '../../core/models';

@Component({
  selector: 'app-allocations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Allocations</h1>
          <p class="page-subtitle">Assign students to rooms and view active room allocations</p>
        </div>
        <button type="button" class="btn btn-outline btn-sm" (click)="loadAllData()" [disabled]="isLoading">
          <i class="fa-solid fa-arrows-rotate" [class.fa-spin]="isLoading"></i> Refresh
        </button>
      </div>

      <!-- Simple "Allocate Room" Card -->
      <div class="card form-card">
        <div class="card-header">
          <h2 class="card-title">Allocate Room</h2>
        </div>
        <div class="card-body">
          <form [formGroup]="allocateForm" (ngSubmit)="submitAllocation()" class="allocate-form-grid">
            <div class="form-group">
              <label class="form-label" for="studentSelect">Student <span class="required">*</span></label>
              <select
                id="studentSelect"
                class="form-select"
                formControlName="studentId"
                [class.is-invalid]="isFieldInvalid('studentId')"
              >
                <option [ngValue]="null" disabled>Select Student...</option>
                <option *ngFor="let s of students" [ngValue]="s.studentId">
                  #{{ s.studentId }} - {{ s.name }} ({{ s.course }})
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="roomSelect">Room <span class="required">*</span></label>
              <select
                id="roomSelect"
                class="form-select"
                formControlName="roomId"
                [class.is-invalid]="isFieldInvalid('roomId')"
              >
                <option [ngValue]="null" disabled>Select Room...</option>
                <option *ngFor="let r of rooms" [ngValue]="r.roomId">
                  Room {{ r.roomNumber }} (ID: {{ r.roomId }}) — {{ r.occupancy }}/{{ r.capacity }} beds
                  {{ (r.capacity - r.occupancy) <= 0 ? ' [FULL]' : ' [' + (r.capacity - r.occupancy) + ' available]' }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label" for="durationInput">Duration (Months) <span class="required">*</span></label>
              <input
                id="durationInput"
                type="number"
                min="1"
                max="36"
                class="form-control"
                formControlName="durationMonths"
                placeholder="e.g. 6"
                [class.is-invalid]="isFieldInvalid('durationMonths')"
              />
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="allocateForm.invalid || isSubmitting">
                <span *ngIf="isSubmitting" class="spinner"></span>
                <span>Allocate Room</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Search & Count -->
      <div class="card filter-card">
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              class="form-control"
              placeholder="Search by student, room, course, or hostel..."
              [value]="searchTerm"
              (input)="onSearchChange($event)"
            />
          </div>
          <div class="filter-count">
            Total Allocations: <strong>{{ filteredAllocations.length }}</strong>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-state">
        <div class="spinner spinner-primary"></div>
        <span>Loading allocations...</span>
      </div>

      <!-- Allocations Table -->
      <div *ngIf="!isLoading" class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Allocation ID</th>
                <th>Student</th>
                <th>Course</th>
                <th>Hostel</th>
                <th>Room Number</th>
                <th>Allocated Date</th>
                <th>Duration</th>
                <th style="text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let item of filteredAllocations">
                <td>#{{ item.allocationId }}</td>
                <td>
                  <strong>{{ item.studentName }}</strong>
                  <div style="font-size: 0.75rem; color: var(--slate-400);">ID: #{{ item.studentId }}</div>
                </td>
                <td>{{ item.course }}</td>
                <td>{{ item.hostelName }} ({{ item.hostelType }})</td>
                <td><strong>Room {{ item.roomNumber }}</strong></td>
                <td>{{ item.allocatedDate }}</td>
                <td>{{ item.durationMonths }} Month(s)</td>
                <td style="text-align: right;">
                  <button
                    type="button"
                    class="btn btn-danger btn-icon btn-sm"
                    title="Delete Allocation"
                    (click)="openDeleteConfirm(item)"
                  >
                    <i class="fa-regular fa-trash-can"></i>
                  </button>
                </td>
              </tr>
              <tr *ngIf="filteredAllocations.length === 0">
                <td colspan="8" class="empty-cell">
                  No allocations found. Use the form above to allocate a room.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-backdrop" *ngIf="itemToDelete" (click)="itemToDelete = null">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title text-danger">Confirm Delete Allocation</h3>
            <button type="button" class="modal-close-btn" (click)="itemToDelete = null">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to release and delete Allocation
              <strong>#{{ itemToDelete.allocationId }}</strong> for student
              <strong>{{ itemToDelete.studentName }}</strong>?
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="itemToDelete = null">Cancel</button>
            <button type="button" class="btn btn-danger" (click)="confirmDelete()" [disabled]="isSubmitting">
              <span>Delete Allocation</span>
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

    .form-card .card-header {
      padding: 14px 20px;
      border-bottom: 1px solid var(--slate-100, #f1f5f9);
    }

    .card-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--slate-900, #0f172a);
    }

    .allocate-form-grid {
      display: grid;
      grid-template-columns: 1.5fr 1.5fr 1fr auto;
      gap: 14px;
      align-items: flex-end;
    }

    @media (max-width: 900px) {
      .allocate-form-grid {
        grid-template-columns: 1fr;
      }
    }

    .form-actions {
      margin-bottom: 18px;
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
export class AllocationsComponent implements OnInit {
  private allocationService = inject(AllocationService);
  private studentService = inject(StudentService);
  private roomService = inject(RoomService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  allocations: StudentRoomAllocation[] = [];
  filteredAllocations: StudentRoomAllocation[] = [];
  students: Student[] = [];
  rooms: Room[] = [];

  isLoading = true;
  isSubmitting = false;
  searchTerm = '';
  itemToDelete: StudentRoomAllocation | null = null;

  allocateForm!: FormGroup;

  ngOnInit(): void {
    this.allocateForm = this.fb.group({
      studentId: [null, [Validators.required]],
      roomId: [null, [Validators.required]],
      durationMonths: [6, [Validators.required, Validators.min(1), Validators.max(36)]]
    });

    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.studentService.getAll().subscribe({
      next: (s) => {
        this.students = s || [];
        this.cdr.markForCheck();
      },
      error: () => {}
    });

    this.roomService.getAll().subscribe({
      next: (r) => {
        this.rooms = r || [];
        this.cdr.markForCheck();
      },
      error: () => {}
    });

    this.allocationService.getStudentRoomAllocations().subscribe({
      next: (data) => {
        this.allocations = data || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorHandler.handleError(err, 'Failed to Load Allocations');
        this.cdr.markForCheck();
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredAllocations = [...this.allocations];
      return;
    }
    const q = this.searchTerm.toLowerCase().trim();
    this.filteredAllocations = this.allocations.filter(a =>
      a.allocationId.toString().includes(q) ||
      a.studentId.toString().includes(q) ||
      a.studentName.toLowerCase().includes(q) ||
      a.course.toLowerCase().includes(q) ||
      a.hostelName.toLowerCase().includes(q) ||
      a.roomNumber.toLowerCase().includes(q)
    );
  }

  isFieldInvalid(field: string): boolean {
    const control = this.allocateForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  submitAllocation(): void {
    if (this.allocateForm.invalid) {
      this.allocateForm.markAllAsTouched();
      return;
    }

    const { studentId, roomId, durationMonths } = this.allocateForm.value;
    this.isSubmitting = true;

    this.allocationService.allocateRoom(studentId, roomId, durationMonths).subscribe({
      next: (msg) => {
        this.isSubmitting = false;
        this.notification.success(msg || 'Room allocated successfully!');
        this.allocateForm.reset({ studentId: null, roomId: null, durationMonths: 6 });
        this.loadAllData();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorHandler.handleError(err, 'Room Allocation Failed');
        this.cdr.markForCheck();
      }
    });
  }

  openDeleteConfirm(item: StudentRoomAllocation): void {
    this.itemToDelete = item;
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;
    this.isSubmitting = true;
    const id = this.itemToDelete.allocationId;

    this.allocationService.delete(id).subscribe({
      next: (msg) => {
        this.isSubmitting = false;
        this.itemToDelete = null;
        this.notification.success(msg || `Allocation #${id} deleted successfully.`);
        this.loadAllData();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorHandler.handleError(err, 'Failed to Delete Allocation');
        this.cdr.markForCheck();
      }
    });
  }
}
