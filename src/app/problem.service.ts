import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  constructor(private http: HttpClient) {}

  getProblemKinds(): Observable<ProblemKind[]> {
    const url = `${this.apiUrl}/kinds`;
    return this.http.get<string[]>(url).pipe(
      map((kinds: string[]) => {
        return kinds.map((kind: string, index: number) => {
          return { id: index, name: kind };
        });
      })
    );
  }

  reportProblem(problem: Problem): Observable<Problem> {
    const url = `${this.apiUrl}/report`;
    return this.http.post<Problem>(url, problem);
  }

  getAllProblems(): Observable<Problem[]> {
    const url = `${this.apiUrl}/problems`;
    return this.http.get<Problem[]>(url);
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

  //additional for forms   
  getLocationService():Promise<any>{
    return new Promise((resolve, reject)=>{
      navigator.geolocation.getCurrentPosition((position)=>{
        resolve(position);
      },(err)=>{
        reject(err);
      })
    })
  }
}
