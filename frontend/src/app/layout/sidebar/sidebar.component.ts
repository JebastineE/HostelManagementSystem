import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <aside class="app-sidebar" [class.mobile-open]="isOpen">
      <div class="sidebar-header">
        <div class="brand">
          <div class="brand-icon">
            <i class="fa-solid fa-hotel"></i>
          </div>
          <div class="brand-text">
            <span class="brand-name">HostelFlow</span>
            <span class="brand-tag">Management System</span>
          </div>
        </div>
        <button type="button" class="close-mobile-btn" (click)="closeSidebar()" aria-label="Close menu">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <nav class="sidebar-nav">
        <a routerLink="/dashboard" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="onNavClick()">
          <i class="fa-solid fa-gauge nav-icon"></i>
          <span>Dashboard</span>
        </a>

        <a routerLink="/students" routerLinkActive="active" (click)="onNavClick()">
          <i class="fa-solid fa-user-graduate nav-icon"></i>
          <span>Students</span>
        </a>

        <a routerLink="/hostels" routerLinkActive="active" (click)="onNavClick()">
          <i class="fa-solid fa-building-user nav-icon"></i>
          <span>Hostels</span>
        </a>

        <a routerLink="/rooms" routerLinkActive="active" (click)="onNavClick()">
          <i class="fa-solid fa-bed nav-icon"></i>
          <span>Rooms</span>
        </a>

        <a routerLink="/allocations" routerLinkActive="active" (click)="onNavClick()">
          <i class="fa-solid fa-clipboard-check nav-icon"></i>
          <span>Allocations</span>
        </a>

        <a routerLink="/activity-log" routerLinkActive="active" (click)="onNavClick()">
          <i class="fa-solid fa-clock-rotate-left nav-icon"></i>
          <span>Activity Log</span>
        </a>
      </nav>

      <div class="sidebar-footer">
        <div class="server-badge">
          <span class="status-dot"></span>
          <div class="server-info">
            <span class="server-name">Spring Boot API</span>
            <span class="server-port">Port: 8085</span>
          </div>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    .app-sidebar {
      width: var(--sidebar-width, 260px);
      height: 100vh;
      background: #0f172a;
      color: #94a3b8;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
      border-right: 1px solid #1e293b;
      overflow-y: auto;
      transition: transform 0.3s ease;
    }

    .sidebar-header {
      padding: 22px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1e293b;
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-icon {
      width: 38px;
      height: 38px;
      background: linear-gradient(135deg, #3b82f6, #6366f1);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ffffff;
      font-size: 1.15rem;
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-name {
      font-family: var(--font-display, sans-serif);
      font-size: 1.2rem;
      font-weight: 700;
      color: #ffffff;
    }

    .brand-tag {
      font-size: 0.7rem;
      color: #64748b;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .close-mobile-btn {
      display: none;
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 6px;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 20px 14px;
    }

    .sidebar-nav a {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 16px;
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      border-radius: 8px;
      transition: all 0.15s ease;
    }

    .nav-icon {
      font-size: 1.05rem;
      width: 22px;
      text-align: center;
      color: #64748b;
    }

    .sidebar-nav a:hover {
      color: #ffffff;
      background-color: #1e293b;
    }

    .sidebar-nav a:hover .nav-icon {
      color: #60a5fa;
    }

    .sidebar-nav a.active {
      color: #ffffff;
      background-color: #1e293b;
      border-left: 3px solid #3b82f6;
      font-weight: 600;
    }

    .sidebar-nav a.active .nav-icon {
      color: #3b82f6;
    }

    .sidebar-footer {
      margin-top: auto;
      padding: 18px 16px;
      border-top: 1px solid #1e293b;
    }

    .server-badge {
      display: flex;
      align-items: center;
      gap: 10px;
      background-color: #1e293b;
      padding: 10px 14px;
      border-radius: 8px;
      border: 1px solid #334155;
    }

    .status-dot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background-color: #10b981;
      box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
      flex-shrink: 0;
    }

    .server-info {
      display: flex;
      flex-direction: column;
    }

    .server-name {
      font-size: 0.78rem;
      font-weight: 600;
      color: #f1f5f9;
    }

    .server-port {
      font-size: 0.7rem;
      color: #94a3b8;
    }

    @media (max-width: 992px) {
      .app-sidebar {
        transform: translateX(-100%);
      }

      .app-sidebar.mobile-open {
        transform: translateX(0);
        box-shadow: 10px 0 30px rgba(0, 0, 0, 0.5);
      }

      .close-mobile-btn {
        display: block;
      }
    }
  `]
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  closeSidebar(): void {
    this.close.emit();
  }

  onNavClick(): void {
    if (window.innerWidth <= 992) {
      this.closeSidebar();
    }
  }
}
