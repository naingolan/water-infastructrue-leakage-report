import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError , Subject} from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface reportedBy{
    name?: string;
    _id?: string;
    phoneNumber?:string;
}
export interface Problem {
  adminApproval: string;
  _id?: any;
  id?: number;
  kind: ProblemKind;
  description: string;
  imageSrc: string;
  location?: string;
  latitude: number;
  longitude: number;
  reporter: string;
  status?: string;
  reportedAt?: Date;
  assignedTo?: string;
  assignedAt?: Date;
  reportedBy?: reportedBy;
}

export interface ProblemKind {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  private apiUrl = 'http://localhost:3000/api/problems';
  private problemKinds: ProblemKind[] = [];
  private problems: Problem[] = [];

  constructor(private http: HttpClient) {}

  fetchProblemKinds(): Observable<ProblemKind[]> {
    const url = `${this.apiUrl}/kinds`;
    return this.http.get<ProblemKind[]>(url).pipe(
      tap((kinds: ProblemKind[]) => {
        this.problemKinds = kinds;
        console.log(this.problemKinds);
      }),
      catchError((error: any) => {
        console.log('Error fetching problem kinds:', error);
        return throwError(error);
      })
    );
  }

  reportProblem(problem: Problem): Observable<Problem> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const url = `${this.apiUrl}/report`;
    return this.http.post<Problem>(url, problem, { headers });
  }

  fetchProblems(): Observable<Problem[]> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const url = `${this.apiUrl}/problems`;
    return this.http.get<Problem[]>(url, { headers });
  }

  fetchProblemsById(userId: string): Observable<Problem[]> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const url = `${this.apiUrl}/problems/${userId}`;
    return this.http.get<Problem[]>(url, { headers });
  }


  fetchProblemById(problemId: String): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const url = `${this.apiUrl}/singleproblem/${problemId}`;
    return this.http.get<any>(url, { headers });
  }

  deleteProblem(problemId: string): Observable<any> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });

    const url = `${this.apiUrl}/${problemId}`;
    return this.http.delete(url, { headers });
  }

  updateProblem(problemId: string, description: string): Observable<Problem> {
    const url = `${this.apiUrl}/${problemId}`;
    const body = { description };
    return this.http.put<Problem>(url, body);
  }

  // Additional method for getting user location
  getLocationService(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
