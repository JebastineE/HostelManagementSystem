import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="header-left">
        <button
          type="button"
          class="menu-toggle-btn"
          (click)="toggleSidebar.emit()"
          aria-label="Toggle navigation menu"
        >
          <i class="fa-solid fa-bars"></i>
        </button>
        <span class="portal-title">Hostel Management System</span>
      </div>

      <div class="header-right">
        <div class="api-badge">
          <i class="fa-solid fa-server"></i>
          <span>http://localhost:8081/api</span>
        </div>

        <div class="user-pill">
          <i class="fa-solid fa-circle-user"></i>
          <span>Admin</span>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .app-header {
      height: 64px;
      background: #ffffff;
      border-bottom: 1px solid var(--slate-200, #e2e8f0);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 24px;
      position: sticky;
      top: 0;
      z-index: 90;
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .menu-toggle-btn {
      display: none;
      background: none;
      border: 1px solid var(--slate-200, #e2e8f0);
      color: var(--slate-700, #334155);
      border-radius: 6px;
      width: 36px;
      height: 36px;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1rem;
    }

    .portal-title {
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--slate-900, #0f172a);
      font-family: var(--font-display, sans-serif);
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .api-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background-color: var(--slate-100, #f1f5f9);
      color: var(--slate-600, #475569);
      padding: 5px 10px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-family: monospace;
      border: 1px solid var(--slate-200, #e2e8f0);
    }

    .api-badge i {
      color: var(--primary-600, #2563eb);
    }

    .user-pill {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--slate-700, #334155);
      font-size: 0.85rem;
      font-weight: 600;
    }

    .user-pill i {
      font-size: 1.1rem;
      color: var(--primary-600, #2563eb);
    }

    @media (max-width: 992px) {
      .menu-toggle-btn {
        display: flex;
      }
      .api-badge {
        display: none;
      }
    }
  `]
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
}
