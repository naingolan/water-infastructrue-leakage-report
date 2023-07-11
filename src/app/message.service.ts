import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private baseUrl = 'http://localhost:3000/api/messages'; // Replace with your API endpoint URL

  constructor(private http: HttpClient) {}

  // Fetch messages based on receiver's ID
  getMessagesByReceiverId(receiverId: string| undefined): Observable<any> {
    const url = `${this.baseUrl}/${receiverId}`;
    return this.http.get(url);
  }

  postMessage(userId: string, message: any): Observable<any> {
    const body = {
      userId,
      message
    };
    return this.http.post(this.baseUrl, body);
  }
  
}
