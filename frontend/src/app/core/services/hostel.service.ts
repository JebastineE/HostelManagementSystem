import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Hostel } from '../models';

@Injectable({
  providedIn: 'root'
})
export class HostelService {
  private readonly apiUrl = `${environment.apiUrl}/hostels`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Hostel[]> {
    return this.http.get<Hostel[]>(this.apiUrl);
  }

  getById(id: number): Observable<Hostel> {
    return this.http.get<Hostel>(`${this.apiUrl}/${id}`);
  }

  create(hostel: Hostel): Observable<Hostel> {
    return this.http.post<Hostel>(this.apiUrl, hostel);
  }

  update(id: number, hostel: Hostel): Observable<Hostel> {
    return this.http.put<Hostel>(`${this.apiUrl}/${id}`, hostel);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' });
  }

  calculateFee(id: number, months: number): Observable<number> {
    const params = new HttpParams().set('months', months.toString());
    return this.http.get<number>(`${this.apiUrl}/${id}/fee`, { params });
  }
}
