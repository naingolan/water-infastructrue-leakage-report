import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnnouncementService {
  private apiUrl = 'http://localhost:3000/api/anouncements';


  constructor(private http: HttpClient) { }

  getAnnouncements(): Observable<any> {
    console.log("Even here you are passing")
    return this.http.get<any>(this.apiUrl);

  }

  createAnnouncement(announcement: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, announcement);
  }
}
