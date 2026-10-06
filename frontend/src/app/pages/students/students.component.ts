import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../core/services/student.service';
import { NotificationService } from '../../core/services/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Student } from '../../core/models';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Students Directory</h1>
          <p class="page-subtitle">Manage registered hostel residents, academic details, and contact information</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-outline" (click)="loadStudents()" [disabled]="isLoading">
            <i class="fa-solid fa-arrows-rotate" [class.fa-spin]="isLoading"></i>
            <span>Refresh</span>
          </button>
          <button type="button" class="btn btn-primary" (click)="openAddModal()">
            <i class="fa-solid fa-user-plus"></i>
            <span>Add Student</span>
          </button>
        </div>
      </div>

      <!-- Search & Filters Bar -->
      <div class="card filter-card">
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Search by ID, name, email, or course..."
              [value]="searchTerm"
              (input)="onSearchChange($event)"
            />
            <button *ngIf="searchTerm" type="button" class="clear-search-btn" (click)="clearSearch()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="filter-count">
            Showing <strong>{{ filteredStudents.length }}</strong> of {{ students.length }} students
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner spinner-primary spinner-lg"></div>
        <p>Loading students list from server...</p>
      </div>

      <!-- Students Table Card -->
      <div *ngIf="!isLoading" class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Student Name</th>
                <th>Email Address</th>
                <th>Phone</th>
                <th>Course</th>
                <th>Academic Year</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let student of filteredStudents">
                <td>
                  <span class="badge badge-neutral">#{{ student.studentId }}</span>
                </td>
                <td>
                  <div class="name-cell">
                    <div class="user-avatar-small">{{ getInitials(student.name) }}</div>
                    <strong>{{ student.name }}</strong>
                  </div>
                </td>
                <td>
                  <a [href]="'mailto:' + student.email" class="email-link">
                    <i class="fa-regular fa-envelope"></i> {{ student.email }}
                  </a>
                </td>
                <td>
                  <span class="phone-text">
                    <i class="fa-solid fa-phone-flip text-slate-400"></i> {{ student.phone }}
                  </span>
                </td>
                <td>
                  <span class="badge badge-indigo">{{ student.course }}</span>
                </td>
                <td>
                  <span class="badge badge-primary">Year {{ student.year }}</span>
                </td>
                <td>
                  <div class="action-buttons-group">
                    <button
                      type="button"
                      class="btn btn-outline btn-icon btn-sm"
                      title="View Profile"
                      (click)="viewStudentDetails(student)"
                    >
                      <i class="fa-regular fa-eye"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-icon btn-sm"
                      title="Edit Student"
                      (click)="openEditModal(student)"
                    >
                      <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger btn-icon btn-sm"
                      title="Delete Student"
                      (click)="openDeleteConfirm(student)"
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredStudents.length === 0">
                <td colspan="7">
                  <div class="empty-state">
                    <div class="empty-icon"><i class="fa-solid fa-user-slash"></i></div>
                    <div class="empty-title">No Students Found</div>
                    <div class="empty-description">
                      {{ searchTerm ? 'No students match your search filter.' : 'No students registered in the database yet. Click "Add Student" to create the first record.' }}
                    </div>
                  </div>
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
            <h3 class="modal-title">
              <i [class]="isEditMode ? 'fa-regular fa-pen-to-square' : 'fa-solid fa-user-plus'"></i>
              {{ isEditMode ? 'Edit Student Details' : 'Add New Student' }}
            </h3>
            <button type="button" class="modal-close-btn" (click)="closeFormModal()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form [formGroup]="studentForm" (ngSubmit)="saveStudent()">
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="studentId">
                    Student ID <span class="required">*</span>
                  </label>
                  <input
                    id="studentId"
                    type="number"
                    class="form-control"
                    formControlName="studentId"
                    placeholder="e.g. 101"
                    [class.is-invalid]="isFieldInvalid('studentId')"
                  />
                  <div *ngIf="isFieldInvalid('studentId')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Valid student ID is required.
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="name">
                    Full Name <span class="required">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    class="form-control"
                    formControlName="name"
                    placeholder="e.g. Alex Johnson"
                    [class.is-invalid]="isFieldInvalid('name')"
                  />
                  <div *ngIf="isFieldInvalid('name')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Name is required (minimum 2 letters).
                  </div>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="email">
                    Email Address <span class="required">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    class="form-control"
                    formControlName="email"
                    placeholder="student@college.edu"
                    [class.is-invalid]="isFieldInvalid('email')"
                  />
                  <div *ngIf="isFieldInvalid('email')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Please enter a valid email address.
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="phone">
                    Phone Number <span class="required">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    class="form-control"
                    formControlName="phone"
                    placeholder="e.g. 9876543210"
                    [class.is-invalid]="isFieldInvalid('phone')"
                  />
                  <div *ngIf="isFieldInvalid('phone')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Phone number is required.
                  </div>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="course">
                    Course / Degree <span class="required">*</span>
                  </label>
                  <input
                    id="course"
                    type="text"
                    class="form-control"
                    formControlName="course"
                    placeholder="e.g. B.Tech Computer Science"
                    [class.is-invalid]="isFieldInvalid('course')"
                  />
                  <div *ngIf="isFieldInvalid('course')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Course is required.
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="year">
                    Academic Year <span class="required">*</span>
                  </label>
                  <select
                    id="year"
                    class="form-select"
                    formControlName="year"
                    [class.is-invalid]="isFieldInvalid('year')"
                  >
                    <option [ngValue]="null" disabled>Select academic year</option>
                    <option [ngValue]="1">Year 1 (Freshman)</option>
                    <option [ngValue]="2">Year 2 (Sophomore)</option>
                    <option [ngValue]="3">Year 3 (Junior)</option>
                    <option [ngValue]="4">Year 4 (Senior)</option>
                    <option [ngValue]="5">Year 5 (PG / Integrated)</option>
                  </select>
                  <div *ngIf="isFieldInvalid('year')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Please select an academic year.
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeFormModal()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                <span *ngIf="isSubmitting" class="spinner"></span>
                <span>{{ isEditMode ? 'Save Changes' : 'Create Student' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- View Student Details Modal -->
      <div class="modal-backdrop" *ngIf="viewingStudent" (click)="viewingStudent = null">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fa-solid fa-id-card"></i> Student Profile
            </h3>
            <button type="button" class="modal-close-btn" (click)="viewingStudent = null">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <div class="profile-card-header">
              <div class="profile-avatar-lg">{{ getInitials(viewingStudent.name) }}</div>
              <div>
                <h2>{{ viewingStudent.name }}</h2>
                <span class="badge badge-primary">Student ID #{{ viewingStudent.studentId }}</span>
              </div>
            </div>

            <div class="details-list">
              <div class="detail-item">
                <span class="d-label"><i class="fa-regular fa-envelope"></i> Email</span>
                <span class="d-val">{{ viewingStudent.email }}</span>
              </div>
              <div class="detail-item">
                <span class="d-label"><i class="fa-solid fa-phone"></i> Phone</span>
                <span class="d-val">{{ viewingStudent.phone }}</span>
              </div>
              <div class="detail-item">
                <span class="d-label"><i class="fa-solid fa-graduation-cap"></i> Course</span>
                <span class="d-val">{{ viewingStudent.course }}</span>
              </div>
              <div class="detail-item">
                <span class="d-label"><i class="fa-solid fa-calendar-days"></i> Academic Year</span>
                <span class="d-val">Year {{ viewingStudent.year }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" (click)="openEditModal(viewingStudent)">
              <i class="fa-regular fa-pen-to-square"></i> Edit
            </button>
            <button type="button" class="btn btn-secondary" (click)="viewingStudent = null">
              Close
            </button>
          </div>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-backdrop" *ngIf="studentToDelete" (click)="studentToDelete = null">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title text-danger">
              <i class="fa-solid fa-triangle-exclamation"></i> Confirm Delete
            </h3>
            <button type="button" class="modal-close-btn" (click)="studentToDelete = null">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to delete student
              <strong>{{ studentToDelete.name }}</strong> (ID: #{{ studentToDelete.studentId }})?
            </p>
            <p class="text-danger" style="font-size: 0.82rem; margin-top: 8px;">
              <i class="fa-solid fa-circle-info"></i>
              Warning: If this student has active allocations, deleting may fail due to foreign key constraints or procedure checks.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="studentToDelete = null">
              Cancel
            </button>
            <button type="button" class="btn btn-danger" (click)="confirmDelete()" [disabled]="isSubmitting">
              <span *ngIf="isSubmitting" class="spinner"></span>
              <span>Confirm Delete</span>
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
      gap: 20px;
    }

    .page-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 800;
      color: var(--slate-900);
    }

    .page-subtitle {
      font-size: 0.86rem;
      color: var(--slate-500);
      margin-top: 2px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
    }

    .filter-card {
      padding: 14px 20px;
    }

    .filter-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 16px;
    }

    .search-input-wrapper {
      position: relative;
      flex: 1;
      max-width: 480px;
    }

    .search-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--slate-400);
      font-size: 0.88rem;
    }

    .search-input {
      padding-left: 38px;
      padding-right: 38px;
    }

    .clear-search-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--slate-400);
      cursor: pointer;
    }

    .filter-count {
      font-size: 0.85rem;
      color: var(--slate-500);
    }

    .name-cell {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .user-avatar-small {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      color: #ffffff;
      font-size: 0.75rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
    }

    .email-link {
      color: var(--slate-600);
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .email-link:hover {
      color: var(--primary-600);
      text-decoration: underline;
    }

    .phone-text {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: monospace;
      font-size: 0.85rem;
    }

    .action-buttons-group {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
    }

    .profile-card-header {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--slate-100);
    }

    .profile-avatar-lg {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #2563eb, #4f46e5);
      color: #ffffff;
      font-size: 1.4rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      text-transform: uppercase;
    }

    .details-list {
      display: flex;
      flex-direction: column;
      gap: 14px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      padding: 10px 14px;
      background-color: var(--slate-50);
      border-radius: var(--radius-md);
      font-size: 0.88rem;
    }

    .detail-item .d-label {
      color: var(--slate-500);
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .detail-item .d-val {
      font-weight: 600;
      color: var(--slate-800);
    }
  `]
})
export class StudentsComponent implements OnInit {
  private studentService = inject(StudentService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  students: Student[] = [];
  filteredStudents: Student[] = [];
  isLoading = true;
  searchTerm = '';

  isFormModalOpen = false;
  isEditMode = false;
  isSubmitting = false;
  viewingStudent: Student | null = null;
  studentToDelete: Student | null = null;

  studentForm!: FormGroup;

  ngOnInit(): void {
    this.initForm();
    this.loadStudents();
  }

  private initForm(): void {
    this.studentForm = this.fb.group({
      studentId: [null, [Validators.required, Validators.min(1)]],
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{7,15}$/)]],
      course: ['', [Validators.required]],
      year: [null, [Validators.required, Validators.min(1), Validators.max(6)]]
    });
  }

  loadStudents(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.studentService.getAll().subscribe({
      next: (data) => {
        this.students = data || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorHandler.handleError(err, 'Failed to Load Students');
        this.cdr.markForCheck();
      }
    });
  }

  onSearchChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.applyFilter();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.applyFilter();
  }

  private applyFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredStudents = [...this.students];
      return;
    }
    const q = this.searchTerm.toLowerCase().trim();
    this.filteredStudents = this.students.filter(s =>
      s.studentId.toString().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.course.toLowerCase().includes(q) ||
      s.phone.includes(q)
    );
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.studentForm.reset();
    this.studentForm.get('studentId')?.enable();
    this.isFormModalOpen = true;
  }

  openEditModal(student: Student): void {
    this.viewingStudent = null;
    this.isEditMode = true;
    this.studentForm.patchValue({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
      phone: student.phone,
      course: student.course,
      year: student.year
    });
    this.studentForm.get('studentId')?.disable();
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.isSubmitting = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.studentForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  saveStudent(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const rawValue = this.studentForm.getRawValue() as Student;

    if (this.isEditMode) {
      this.studentService.update(rawValue.studentId, rawValue).subscribe({
        next: (updated) => {
          this.isSubmitting = false;
          this.closeFormModal();
          this.notification.success(`Student "${updated.name}" updated successfully.`);
          this.loadStudents();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorHandler.handleError(err, 'Failed to Update Student');
          this.cdr.markForCheck();
        }
      });
    } else {
      this.studentService.create(rawValue).subscribe({
        next: (created) => {
          this.isSubmitting = false;
          this.closeFormModal();
          this.notification.success(`Student "${created.name}" registered successfully.`);
          this.loadStudents();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorHandler.handleError(err, 'Failed to Create Student');
          this.cdr.markForCheck();
        }
      });
    }
  }

  viewStudentDetails(student: Student): void {
    this.viewingStudent = student;
  }

  openDeleteConfirm(student: Student): void {
    this.studentToDelete = student;
  }

  confirmDelete(): void {
    if (!this.studentToDelete) return;
    this.isSubmitting = true;
    const id = this.studentToDelete.studentId;
    const name = this.studentToDelete.name;

    this.studentService.delete(id).subscribe({
      next: (msg) => {
        this.isSubmitting = false;
        this.studentToDelete = null;
        this.notification.success(msg || `Student "${name}" deleted successfully.`);
        this.loadStudents();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorHandler.handleError(err, 'Failed to Delete Student');
        this.cdr.markForCheck();
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return 'S';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
}
