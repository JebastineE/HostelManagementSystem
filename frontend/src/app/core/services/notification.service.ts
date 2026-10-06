import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ToastNotification } from '../models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<ToastNotification[]>([]);
  public notifications$: Observable<ToastNotification[]> = this.notificationsSubject.asObservable();

  show(notification: Omit<ToastNotification, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = {
      ...notification,
      id,
      durationMs: notification.durationMs ?? 4500
    };

    const current = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...current, newToast]);

    if (newToast.durationMs && newToast.durationMs > 0) {
      setTimeout(() => {
        this.remove(id);
      }, newToast.durationMs);
    }
  }

  success(message: string, title: string = 'Success'): void {
    this.show({ type: 'success', title, message });
  }

  error(message: string, title: string = 'Error'): void {
    this.show({ type: 'error', title, message, durationMs: 6500 });
  }

  warning(message: string, title: string = 'Warning'): void {
    this.show({ type: 'warning', title, message });
  }

  info(message: string, title: string = 'Information'): void {
    this.show({ type: 'info', title, message });
  }

  remove(id: string): void {
    const current = this.notificationsSubject.getValue();
    this.notificationsSubject.next(current.filter(t => t.id !== id));
  }
}
