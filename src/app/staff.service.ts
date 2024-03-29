
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';


export interface Staff{
  staffStatus: string;
  _id?: number;
  name: string;
  position: string;
  department: string;
  salary: number;
}

@Injectable(
  {providedIn: 'root'}
)
export class StaffService {
  private apiUrl = 'http://localhost:3000/api/problems';

  constructor(
    private http: HttpClient,
    private router: Router
    ) {}

  getStaffList(): Observable<Staff[]> {
    console.log("I am not reached at all");
    return this.http.get<Staff[]>( `${this.apiUrl}/staff`);
  }

  createStaff(newStaff: Staff): Observable<Staff> {
    return this.http.post<Staff>('http://localhost:3000/api/users/register', newStaff);
  }

  deleteStaff(staffId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${staffId}`);
  }

  updateStaff(staffId: string, staffData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${staffId}`, staffData);
  }

  assignStaff(problemId: string, staffId: string, staffName: string): Observable<any> {
    const payload = {
      staffId: staffId,
      staffName: staffName
    };
    return this.http.put<any>(`${this.apiUrl}/${problemId}/assign`, payload);
    // .pipe(
    //   tap(() => {
    //     // Reload the current page
    //     // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
    //     //   this.router.navigate([this.router.url]);
    //     // });
    //   }));
  }


  getAssignedProblems(staffId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/assigned/${staffId}`);
  }

  updateProblemStatus(id: string, status: string, staffFeedback?: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/edit`;
    const body = {
      status,
      staffFeedback
    };

    return this.http.put(url, body);
  }

  updateProblemSolution(id: string, status: string): Observable<any> {
    const url = `${this.apiUrl}/${id}/solved`;
    const body = {
      status,
    };

    return this.http.put(url, body);
  }



}
