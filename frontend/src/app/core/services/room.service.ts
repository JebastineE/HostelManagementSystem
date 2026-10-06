import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Room } from '../models';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private readonly apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getById(id: number): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`);
  }

  create(room: Room): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  update(id: number, room: Room): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  getAboveAverage(): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.apiUrl}/above-average`);
  }
}
