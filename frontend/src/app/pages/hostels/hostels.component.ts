import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HostelService } from '../../core/services/hostel.service';
import { NotificationService } from '../../core/services/notification.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Hostel } from '../../core/models';

@Component({
  selector: 'app-hostels',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="page-container">
      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Hostels Management</h1>
          <p class="page-subtitle">Manage campus residence buildings, room configurations, and monthly rental rates</p>
        </div>
        <div class="header-actions">
          <button type="button" class="btn btn-outline" (click)="loadHostels()" [disabled]="isLoading">
            <i class="fa-solid fa-arrows-rotate" [class.fa-spin]="isLoading"></i>
            <span>Refresh</span>
          </button>
          <button type="button" class="btn btn-outline-primary" (click)="openFeeCalculatorModal(null)">
            <i class="fa-solid fa-calculator"></i>
            <span>Fee Calculator</span>
          </button>
          <button type="button" class="btn btn-primary" (click)="openAddModal()">
            <i class="fa-solid fa-plus"></i>
            <span>Add Hostel</span>
          </button>
        </div>
      </div>

      <!-- Search & Filters -->
      <div class="card filter-card">
        <div class="filter-bar">
          <div class="search-input-wrapper">
            <i class="fa-solid fa-magnifying-glass search-icon"></i>
            <input
              type="text"
              class="form-control search-input"
              placeholder="Search by ID, hostel name, type, or location..."
              [value]="searchTerm"
              (input)="onSearchChange($event)"
            />
            <button *ngIf="searchTerm" type="button" class="clear-search-btn" (click)="clearSearch()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="filter-count">
            Showing <strong>{{ filteredHostels.length }}</strong> of {{ hostels.length }} hostels
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div *ngIf="isLoading" class="loading-container">
        <div class="spinner spinner-primary spinner-lg"></div>
        <p>Loading hostels data from server...</p>
      </div>

      <!-- Hostels Table Card -->
      <div *ngIf="!isLoading" class="card">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Hostel ID</th>
                <th>Hostel Name</th>
                <th>Hostel Type</th>
                <th>Campus Location</th>
                <th>Monthly Fee</th>
                <th style="text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let hostel of filteredHostels">
                <td><span class="badge badge-neutral">#{{ hostel.hostelId }}</span></td>
                <td>
                  <div class="hostel-name-cell">
                    <div class="hostel-icon"><i class="fa-solid fa-building"></i></div>
                    <strong>{{ hostel.hostelName }}</strong>
                  </div>
                </td>
                <td>
                  <span class="badge" [ngClass]="getTypeBadgeClass(hostel.hostelType)">
                    {{ hostel.hostelType }}
                  </span>
                </td>
                <td>
                  <span class="location-text">
                    <i class="fa-solid fa-location-dot text-slate-400"></i> {{ hostel.location }}
                  </span>
                </td>
                <td>
                  <strong class="fee-text">
                    ₹{{ hostel.monthlyFee | number:'1.2-2' }} <small>/ month</small>
                  </strong>
                </td>
                <td>
                  <div class="action-buttons-group">
                    <button
                      type="button"
                      class="btn btn-outline-primary btn-sm"
                      title="Calculate Fee"
                      (click)="openFeeCalculatorModal(hostel)"
                    >
                      <i class="fa-solid fa-calculator"></i>
                      <span>Fee</span>
                    </button>
                    <button
                      type="button"
                      class="btn btn-outline btn-icon btn-sm"
                      title="Edit Hostel"
                      (click)="openEditModal(hostel)"
                    >
                      <i class="fa-regular fa-pen-to-square"></i>
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger btn-icon btn-sm"
                      title="Delete Hostel"
                      (click)="openDeleteConfirm(hostel)"
                    >
                      <i class="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filteredHostels.length === 0">
                <td colspan="6">
                  <div class="empty-state">
                    <div class="empty-icon"><i class="fa-solid fa-hotel"></i></div>
                    <div class="empty-title">No Hostels Found</div>
                    <div class="empty-description">
                      {{ searchTerm ? 'No hostels matched your search.' : 'No hostels registered yet. Click "Add Hostel" to register a hostel.' }}
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
              <i [class]="isEditMode ? 'fa-regular fa-pen-to-square' : 'fa-solid fa-hotel'"></i>
              {{ isEditMode ? 'Edit Hostel Building' : 'Add New Hostel Building' }}
            </h3>
            <button type="button" class="modal-close-btn" (click)="closeFormModal()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form [formGroup]="hostelForm" (ngSubmit)="saveHostel()">
            <div class="modal-body">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="hostelId">
                    Hostel ID <span class="required">*</span>
                  </label>
                  <input
                    id="hostelId"
                    type="number"
                    class="form-control"
                    formControlName="hostelId"
                    placeholder="e.g. 1"
                    [class.is-invalid]="isFieldInvalid('hostelId')"
                  />
                  <div *ngIf="isFieldInvalid('hostelId')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Valid Hostel ID is required.
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="hostelName">
                    Hostel Name <span class="required">*</span>
                  </label>
                  <input
                    id="hostelName"
                    type="text"
                    class="form-control"
                    formControlName="hostelName"
                    placeholder="e.g. Kaveri Boys Block A"
                    [class.is-invalid]="isFieldInvalid('hostelName')"
                  />
                  <div *ngIf="isFieldInvalid('hostelName')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Hostel name is required.
                  </div>
                </div>
              </div>

              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label" for="hostelType">
                    Hostel Type <span class="required">*</span>
                  </label>
                  <select
                    id="hostelType"
                    class="form-select"
                    formControlName="hostelType"
                    [class.is-invalid]="isFieldInvalid('hostelType')"
                  >
                    <option value="" disabled>Select hostel type</option>
                    <option value="Boys">Boys Hostel</option>
                    <option value="Girls">Girls Hostel</option>
                    <option value="Co-ed">Co-ed Residence</option>
                    <option value="Staff">Faculty / Staff</option>
                  </select>
                  <div *ngIf="isFieldInvalid('hostelType')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Please select a hostel type.
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label" for="monthlyFee">
                    Monthly Fee (₹) <span class="required">*</span>
                  </label>
                  <input
                    id="monthlyFee"
                    type="number"
                    step="0.01"
                    class="form-control"
                    formControlName="monthlyFee"
                    placeholder="e.g. 6500.00"
                    [class.is-invalid]="isFieldInvalid('monthlyFee')"
                  />
                  <div *ngIf="isFieldInvalid('monthlyFee')" class="form-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    Valid monthly fee is required.
                  </div>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label" for="location">
                  Campus Location / Address <span class="required">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  class="form-control"
                  formControlName="location"
                  placeholder="e.g. North Campus, Sector 4"
                  [class.is-invalid]="isFieldInvalid('location')"
                />
                <div *ngIf="isFieldInvalid('location')" class="form-error">
                  <i class="fa-solid fa-circle-exclamation"></i>
                  Location is required.
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeFormModal()">
                Cancel
              </button>
              <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                <span *ngIf="isSubmitting" class="spinner"></span>
                <span>{{ isEditMode ? 'Save Changes' : 'Create Hostel' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Fee Calculator Modal -->
      <div class="modal-backdrop" *ngIf="isFeeModalOpen" (click)="closeFeeModal()">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fa-solid fa-calculator" style="color: var(--primary-600);"></i>
              Calculate Hostel Fee
            </h3>
            <button type="button" class="modal-close-btn" (click)="closeFeeModal()">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>

          <form [formGroup]="feeForm" (ngSubmit)="calculateFee()">
            <div class="modal-body">
              <p class="calc-intro">
                Call backend API <code>GET /api/hostels/&#123;id&#125;/fee?months=...</code> to compute the total fee for the selected duration using the backend database logic.
              </p>

              <div class="form-group">
                <label class="form-label" for="calcHostelId">Select Hostel <span class="required">*</span></label>
                <select id="calcHostelId" class="form-select" formControlName="hostelId">
                  <option [ngValue]="null" disabled>Choose a hostel...</option>
                  <option *ngFor="let h of hostels" [ngValue]="h.hostelId">
                    {{ h.hostelName }} ({{ h.hostelType }}) - ₹{{ h.monthlyFee }}/mo
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label" for="calcMonths">Number of Months <span class="required">*</span></label>
                <input
                  id="calcMonths"
                  type="number"
                  min="1"
                  max="36"
                  class="form-control"
                  formControlName="months"
                  placeholder="e.g. 6"
                />
              </div>

              <!-- Calculation Result Banner -->
              <div *ngIf="calculatedFeeResult !== null" class="fee-result-box">
                <div class="fee-result-label">Computed Total Hostel Fee:</div>
                <div class="fee-result-amount">₹{{ calculatedFeeResult | number:'1.2-2' }}</div>
                <div class="fee-result-details">
                  Calculated by Spring Boot for {{ feeForm.get('months')?.value }} month(s)
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="closeFeeModal()">Close</button>
              <button type="submit" class="btn btn-primary" [disabled]="feeForm.invalid || isCalculatingFee">
                <span *ngIf="isCalculatingFee" class="spinner"></span>
                <span>Calculate Fee</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div class="modal-backdrop" *ngIf="hostelToDelete" (click)="hostelToDelete = null">
        <div class="modal-dialog" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3 class="modal-title text-danger">
              <i class="fa-solid fa-triangle-exclamation"></i> Confirm Delete
            </h3>
            <button type="button" class="modal-close-btn" (click)="hostelToDelete = null">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div class="modal-body">
            <p>
              Are you sure you want to delete hostel building
              <strong>{{ hostelToDelete.hostelName }}</strong> (ID: #{{ hostelToDelete.hostelId }})?
            </p>
            <p class="text-danger" style="font-size: 0.82rem; margin-top: 8px;">
              <i class="fa-solid fa-circle-info"></i>
              Warning: Hostels containing existing rooms or allocations cannot be deleted until associated records are removed.
            </p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="hostelToDelete = null">
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

    .hostel-name-cell {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .hostel-icon {
      width: 30px;
      height: 30px;
      background-color: var(--primary-100);
      color: var(--primary-600);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
    }

    .fee-text {
      color: var(--slate-900);
      font-size: 0.95rem;
    }

    .fee-text small {
      color: var(--slate-400);
      font-weight: normal;
    }

    .action-buttons-group {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 6px;
    }

    .calc-intro {
      font-size: 0.85rem;
      color: var(--slate-600);
      background-color: var(--slate-50);
      padding: 10px 14px;
      border-radius: var(--radius-md);
      margin-bottom: 18px;
      border: 1px solid var(--slate-200);
    }

    .fee-result-box {
      margin-top: 20px;
      background: linear-gradient(135deg, #eff6ff, #e0e7ff);
      border: 1px solid #bfdbfe;
      border-radius: var(--radius-lg);
      padding: 20px;
      text-align: center;
    }

    .fee-result-label {
      font-size: 0.82rem;
      color: var(--slate-600);
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.05em;
    }

    .fee-result-amount {
      font-family: var(--font-display);
      font-size: 2.2rem;
      font-weight: 800;
      color: var(--primary-700);
      margin: 4px 0;
    }

    .fee-result-details {
      font-size: 0.8rem;
      color: var(--slate-500);
    }
  `]
})
export class HostelsComponent implements OnInit {
  private hostelService = inject(HostelService);
  private notification = inject(NotificationService);
  private errorHandler = inject(ErrorHandlerService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  hostels: Hostel[] = [];
  filteredHostels: Hostel[] = [];
  isLoading = true;
  searchTerm = '';

  isFormModalOpen = false;
  isEditMode = false;
  isSubmitting = false;
  hostelToDelete: Hostel | null = null;

  isFeeModalOpen = false;
  isCalculatingFee = false;
  calculatedFeeResult: number | null = null;

  hostelForm!: FormGroup;
  feeForm!: FormGroup;

  ngOnInit(): void {
    this.initForms();
    this.loadHostels();
  }

  private initForms(): void {
    this.hostelForm = this.fb.group({
      hostelId: [null, [Validators.required, Validators.min(1)]],
      hostelName: ['', [Validators.required, Validators.minLength(2)]],
      hostelType: ['', [Validators.required]],
      location: ['', [Validators.required]],
      monthlyFee: [null, [Validators.required, Validators.min(0)]]
    });

    this.feeForm = this.fb.group({
      hostelId: [null, [Validators.required]],
      months: [1, [Validators.required, Validators.min(1), Validators.max(36)]]
    });
  }

  loadHostels(): void {
    this.isLoading = true;
    this.cdr.markForCheck();
    this.hostelService.getAll().subscribe({
      next: (data) => {
        this.hostels = data || [];
        this.applyFilter();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorHandler.handleError(err, 'Failed to Load Hostels');
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
      this.filteredHostels = [...this.hostels];
      return;
    }
    const q = this.searchTerm.toLowerCase().trim();
    this.filteredHostels = this.hostels.filter(h =>
      h.hostelId.toString().includes(q) ||
      h.hostelName.toLowerCase().includes(q) ||
      h.hostelType.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q)
    );
  }

  getTypeBadgeClass(type: string): string {
    const t = (type || '').toLowerCase();
    if (t.includes('boy')) return 'badge-primary';
    if (t.includes('girl')) return 'badge-warning';
    return 'badge-indigo';
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.hostelForm.reset({ hostelType: '' });
    this.hostelForm.get('hostelId')?.enable();
    this.isFormModalOpen = true;
  }

  openEditModal(hostel: Hostel): void {
    this.isEditMode = true;
    this.hostelForm.patchValue({
      hostelId: hostel.hostelId,
      hostelName: hostel.hostelName,
      hostelType: hostel.hostelType,
      location: hostel.location,
      monthlyFee: hostel.monthlyFee
    });
    this.hostelForm.get('hostelId')?.disable();
    this.isFormModalOpen = true;
  }

  closeFormModal(): void {
    this.isFormModalOpen = false;
    this.isSubmitting = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.hostelForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  saveHostel(): void {
    if (this.hostelForm.invalid) {
      this.hostelForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const rawValue = this.hostelForm.getRawValue() as Hostel;

    if (this.isEditMode) {
      this.hostelService.update(rawValue.hostelId, rawValue).subscribe({
        next: (updated) => {
          this.isSubmitting = false;
          this.closeFormModal();
          this.notification.success(`Hostel "${updated.hostelName}" updated successfully.`);
          this.loadHostels();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorHandler.handleError(err, 'Failed to Update Hostel');
          this.cdr.markForCheck();
        }
      });
    } else {
      this.hostelService.create(rawValue).subscribe({
        next: (created) => {
          this.isSubmitting = false;
          this.closeFormModal();
          this.notification.success(`Hostel "${created.hostelName}" added successfully.`);
          this.loadHostels();
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isSubmitting = false;
          this.errorHandler.handleError(err, 'Failed to Create Hostel');
          this.cdr.markForCheck();
        }
      });
    }
  }

  openDeleteConfirm(hostel: Hostel): void {
    this.hostelToDelete = hostel;
  }

  confirmDelete(): void {
    if (!this.hostelToDelete) return;
    this.isSubmitting = true;
    const id = this.hostelToDelete.hostelId;
    const name = this.hostelToDelete.hostelName;

    this.hostelService.delete(id).subscribe({
      next: (msg) => {
        this.isSubmitting = false;
        this.hostelToDelete = null;
        this.notification.success(msg || `Hostel "${name}" deleted successfully.`);
        this.loadHostels();
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorHandler.handleError(err, 'Failed to Delete Hostel');
        this.cdr.markForCheck();
      }
    });
  }

  openFeeCalculatorModal(hostel: Hostel | null): void {
    this.calculatedFeeResult = null;
    if (hostel) {
      this.feeForm.patchValue({ hostelId: hostel.hostelId, months: 6 });
    } else if (this.hostels.length > 0 && !this.feeForm.get('hostelId')?.value) {
      this.feeForm.patchValue({ hostelId: this.hostels[0].hostelId, months: 6 });
    }
    this.isFeeModalOpen = true;
  }

  closeFeeModal(): void {
    this.isFeeModalOpen = false;
    this.calculatedFeeResult = null;
  }

  calculateFee(): void {
    if (this.feeForm.invalid) return;

    const hostelId = this.feeForm.get('hostelId')?.value;
    const months = this.feeForm.get('months')?.value;

    this.isCalculatingFee = true;
    this.hostelService.calculateFee(hostelId, months).subscribe({
      next: (fee) => {
        this.isCalculatingFee = false;
        this.calculatedFeeResult = Number(fee);
        this.notification.success(`Calculated fee: ₹${this.calculatedFeeResult}`);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isCalculatingFee = false;
        this.errorHandler.handleError(err, 'Fee Calculation Failed');
        this.cdr.markForCheck();
      }
    });
  }
}
