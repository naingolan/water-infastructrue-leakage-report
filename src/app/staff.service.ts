
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Staff{
  id?: number;
  name: string;
  position: string;
  department: string;
  salary: number;
}

@Injectable(
  {providedIn: 'root'}
)
export class StaffService {
  private apiUrl = 'http://localhost:3000/api/problems/staff';

  constructor(private http: HttpClient) {}

  getStaffList(): Observable<Staff[]> {
    return this.http.get<Staff[]>(this.apiUrl);
  }

  createStaff(newStaff: Staff): Observable<Staff> {
    return this.http.post<Staff>(this.apiUrl, newStaff);
  }
}
