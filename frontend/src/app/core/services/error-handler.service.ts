import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(private notificationService: NotificationService) {}

  public formatErrorMessage(error: any): string {
    if (!error) {
      return 'An unexpected error occurred. Please try again.';
    }

    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return 'Backend server is unavailable. Please ensure the Spring Boot backend is running on http://localhost:8081.';
      }

      const rawMsg: string = typeof error.error === 'string'
        ? error.error
        : (error.error?.message || error.error?.error || '');

      if (rawMsg) {
        // Specific MySQL stored procedure error signals
        if (rawMsg.includes('Student does not exist')) {
          return 'Student does not exist.';
        }
        if (rawMsg.includes('Room does not exist')) {
          return 'Room does not exist.';
        }
        if (rawMsg.includes('Room is already full') || rawMsg.includes('Room full') || rawMsg.toLowerCase().includes('capacity')) {
          return 'Room is already full.';
        }
        if (rawMsg.includes('Student is already allocated') || rawMsg.includes('already allocated')) {
          return 'Student is already allocated to a room.';
        }
        if (rawMsg.includes('Duration must be greater than 0')) {
          return 'Duration must be greater than 0 months.';
        }

        // Cleanly extract message if wrapped by Hibernate: JDBC exception executing SQL [message] [SQL]
        const jdbcMatch = rawMsg.match(/JDBC exception executing SQL \[(.*?)\]/);
        if (jdbcMatch && jdbcMatch[1]) {
          return jdbcMatch[1];
        }

        if (typeof error.error === 'string' && error.error.trim().length > 0) {
          return error.error;
        }

        if (error.error && typeof error.error === 'object' && error.error.message) {
          return error.error.message;
        }
      }

      switch (error.status) {
        case 400:
          return 'Invalid request data. Please check all fields and try again.';
        case 404:
          return 'Requested record was not found on the server.';
        case 409:
          return 'Conflict detected: A record with this information already exists.';
        case 500:
          return 'Server error processing request. Please check database constraints or stored procedure requirements.';
        default:
          return `Request failed with HTTP status ${error.status} (${error.statusText || 'Unknown Error'}).`;
      }
    }

    return error.message || 'An unexpected error occurred.';
  }

  public handleError(error: any, customTitle: string = 'Operation Failed'): string {
    const message = this.formatErrorMessage(error);
    this.notificationService.error(message, customTitle);
    return message;
  }
}
