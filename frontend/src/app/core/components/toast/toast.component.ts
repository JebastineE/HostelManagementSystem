import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';
import { ToastNotification } from '../../models';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="(notifications$ | async) as toasts">
      <div
        *ngFor="let toast of toasts"
        class="toast-item"
        [ngClass]="'toast-' + toast.type"
      >
        <div class="toast-icon">
          <i *ngIf="toast.type === 'success'" class="fa-solid fa-circle-check"></i>
          <i *ngIf="toast.type === 'error'" class="fa-solid fa-circle-xmark"></i>
          <i *ngIf="toast.type === 'warning'" class="fa-solid fa-triangle-exclamation"></i>
          <i *ngIf="toast.type === 'info'" class="fa-solid fa-circle-info"></i>
        </div>
        <div class="toast-content">
          <div *ngIf="toast.title" class="toast-title">{{ toast.title }}</div>
          <div class="toast-message">{{ toast.message }}</div>
        </div>
        <button
          type="button"
          class="toast-close"
          (click)="notificationService.remove(toast.id)"
          aria-label="Close notification"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container {
      position: fixed;
      top: 24px;
      right: 24px;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 420px;
      width: calc(100% - 48px);
      pointer-events: none;
    }

    .toast-item {
      pointer-events: auto;
      display: flex;
      align-items: flex-start;
      gap: 14px;
      padding: 16px;
      background: #ffffff;
      border-radius: var(--radius-lg, 14px);
      box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1);
      border-left: 5px solid transparent;
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      transition: all 0.2s ease;
    }

    .toast-success {
      border-left-color: var(--success-500, #10b981);
    }
    .toast-success .toast-icon {
      color: var(--success-500, #10b981);
    }

    .toast-error {
      border-left-color: var(--danger-500, #ef4444);
    }
    .toast-error .toast-icon {
      color: var(--danger-500, #ef4444);
    }

    .toast-warning {
      border-left-color: var(--warning-500, #f59e0b);
    }
    .toast-warning .toast-icon {
      color: var(--warning-500, #f59e0b);
    }

    .toast-info {
      border-left-color: var(--primary-500, #3b82f6);
    }
    .toast-info .toast-icon {
      color: var(--primary-500, #3b82f6);
    }

    .toast-icon {
      font-size: 1.25rem;
      margin-top: 1px;
      flex-shrink: 0;
    }

    .toast-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .toast-title {
      font-weight: 700;
      font-size: 0.92rem;
      color: var(--slate-900, #0f172a);
    }

    .toast-message {
      font-size: 0.85rem;
      color: var(--slate-600, #475569);
      line-height: 1.4;
      word-break: break-word;
    }

    .toast-close {
      background: none;
      border: none;
      color: var(--slate-400, #94a3b8);
      cursor: pointer;
      padding: 4px;
      font-size: 0.95rem;
      border-radius: 4px;
      transition: color 0.15s ease;
      flex-shrink: 0;
    }

    .toast-close:hover {
      color: var(--slate-700, #334155);
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
  `]
})
export class ToastComponent {
  notificationService = inject(NotificationService);
  notifications$ = this.notificationService.notifications$;
}
