import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { StudentService } from './student.service';
import { HostelService } from './hostel.service';
import { RoomService } from './room.service';
import { AllocationService } from './allocation.service';
import {
  Allocation,
  DashboardStats,
  Hostel,
  Room,
  Student,
  StudentRoomAllocation
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(
    private studentService: StudentService,
    private hostelService: HostelService,
    private roomService: RoomService,
    private allocationService: AllocationService
  ) {}

  getDashboardData(): Observable<DashboardStats> {
    return forkJoin({
      students: this.studentService.getAll().pipe(catchError(() => of([] as Student[]))),
      hostels: this.hostelService.getAll().pipe(catchError(() => of([] as Hostel[]))),
      rooms: this.roomService.getAll().pipe(catchError(() => of([] as Room[]))),
      allocations: this.allocationService.getAll().pipe(catchError(() => of([] as Allocation[]))),
      studentRooms: this.allocationService.getStudentRoomAllocations().pipe(catchError(() => of([] as StudentRoomAllocation[])))
    }).pipe(
      map(({ students, hostels, rooms, allocations, studentRooms }) => {
        const totalCapacity = rooms.reduce(
          (acc: number, curr) => acc + Number(curr.capacity || 0),
          0
        );

        const occupiedBeds = rooms.reduce(
          (acc: number, curr) => acc + Number(curr.occupancy || 0),
          0
        );
        const availableBeds = Math.max(0, totalCapacity - occupiedBeds);
        const occupancyRate = totalCapacity > 0 ? Math.round((occupiedBeds / totalCapacity) * 100) : 0;

        return {
          totalStudents: students.length,
          totalHostels: hostels.length,
          totalRooms: rooms.length,
          totalAllocations: allocations.length,
          totalCapacity,
          occupiedBeds,
          availableBeds,
          occupancyRate,
          recentAllocations: studentRooms.slice(-6).reverse()
        };
      })
    );
  }
}
