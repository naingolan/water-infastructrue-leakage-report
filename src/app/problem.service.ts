import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EventService } from './event.service';
import { ChangeDetectorRef } from '@angular/core';


export interface Problem {
  id?: number;
  kind: ProblemKind;
  description: string;
  imageSrc: string;
  latitude: number;
  longitude: number;
  reporter: string;
  status?: string;
  reportedAt?: Date;
  assignedTo?: string;
  assignedAt?: Date;
  // Other optional properties
}

export interface ProblemKind {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProblemService {
  apiUrl = 'http://localhost:3000/api/problems';
  problemKinds: ProblemKind[] = [];
  problems: Problem[] = [];

  constructor(
    private http: HttpClient,
    private changeDetector  : ChangeDetectorRef,
    ) {}

  fetchProblemKinds(): void {
    const url = `${this.apiUrl}/kinds`;
    this.http
      .get<ProblemKind[]>(url)
      .pipe(
        tap((kinds: ProblemKind[]) => {
          this.problemKinds = kinds;
          console.log(this.problemKinds);
        }),
        catchError((error: any) => {
          console.log('Error fetching problem kinds:', error);
          return throwError(error);
        })
      )
      .subscribe();
  }

  reportProblem(problem: Problem): Observable<Problem> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const url = `${this.apiUrl}/report`;

    return this.http.post<Problem>(url, problem, { headers }).pipe(
      tap((newProblem: Problem) => {
        // Update the list of problems by fetching the updated list
        this.fetchProblems().subscribe();
        this.changeDetector.detectChanges();
      })
    );
  }

  fetchProblems(): Observable<Problem[]> {
    const authToken = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    const url = `${this.apiUrl}/problems`;

    return this.http.get<Problem[]>(url, { headers }).pipe(
      tap((problems: Problem[]) => {
        this.problems = problems;
      })
    );
  }

  deleteProblem(problemId: number): Observable<any> {
    const url = `${this.apiUrl}/problems/${problemId}`;
    return this.http.delete(url);
  }

  updateProblem(problemId: number, description: string): Observable<Problem> {
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
