import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  userData: any;
  private userCreated = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) { }

  // Fetch user data based on userId and store it in the userData variable
  fetchUserData(userId: string): Observable<any> {
    const url = `http://localhost:3000/api/users/${userId}`;
    return this.http.get(url).pipe(
      tap((data) => {
        this.userData = data;
      })
    );
  }
  

createdSignature(): Observable<boolean> {
  const token = localStorage.getItem('authToken');
  if (token) {
    return of(true);
  } else {
    return this.userCreated.asObservable();
  }
}


  // Function to update the login status
  updateUserCreatedStatus(isLogged: boolean): void {
    this.userCreated.next(isLogged);
  }
  // Get the stored user data
  getUserData(): any {
    return this.userData;
  }

  
}