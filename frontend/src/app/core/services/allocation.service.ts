import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Allocation, StudentRoomAllocation } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AllocationService {
  private readonly apiUrl = `${environment.apiUrl}/allocations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Allocation[]> {
    return this.http.get<Allocation[]>(this.apiUrl);
  }

  getById(id: number): Observable<Allocation> {
    return this.http.get<Allocation>(`${this.apiUrl}/${id}`);
  }

  create(allocation: Allocation): Observable<Allocation> {
    return this.http.post<Allocation>(this.apiUrl, allocation);
  }

  update(id: number, allocation: Allocation): Observable<Allocation> {
    return this.http.put<Allocation>(`${this.apiUrl}/${id}`, allocation);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  allocateRoom(studentId: number, roomId: number, durationMonths: number): Observable<string> {
    const params = new HttpParams()
      .set('studentId', studentId.toString())
      .set('roomId', roomId.toString())
      .set('durationMonths', durationMonths.toString());

    return this.http.post(`${this.apiUrl}/allocate`, null, {
      params,
      responseType: 'text'
    });
  }

  getStudentRoomAllocations(): Observable<StudentRoomAllocation[]> {
    return this.http.get<any[]>(`${this.apiUrl}/student-room`).pipe(
      map(items => {
        if (!Array.isArray(items)) return [];
        return items.map(item => {
          // If returned as an Object[] (tuple array from native SQL)
          if (Array.isArray(item)) {
            return {
              allocationId: Number(item[0]),
              studentId: Number(item[1]),
              studentName: String(item[2] || ''),
              course: String(item[3] || ''),
              hostelName: String(item[4] || ''),
              hostelType: String(item[5] || ''),
              roomNumber: String(item[6] || ''),
              allocatedDate: String(item[7] || ''),
              durationMonths: Number(item[8] || 0)
            } as StudentRoomAllocation;
          }
          // If returned as key-value JSON objects
          return {
            allocationId: item.allocationId,
            studentId: item.studentId,
            studentName: item.studentName,
            course: item.course,
            hostelName: item.hostelName,
            hostelType: item.hostelType,
            roomNumber: item.roomNumber,
            allocatedDate: item.allocatedDate,
            durationMonths: item.durationMonths
          } as StudentRoomAllocation;
        });
      })
    );
  }
}
