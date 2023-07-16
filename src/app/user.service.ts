import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userData: any;
  private userCreated = new BehaviorSubject<boolean>(false);
  apiUrl = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) { }

  fetchUserData(userId: string): Observable<any> {
    const url = `http://localhost:3000/api/users/${userId}`;
    return this.http.get(url).pipe(
      tap((data) => {
        this.userData = data;
      })
    );
  }
  getUserRole(): string {
    if (this.userData && this.userData.role) {
      console.log(this.userData.role);
      return this.userData.role;
    } else{
      return "invalidated";
    }
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

  //Change password
  changePassword(userId: string, oldPassword: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/update/password/${userId}`;
    const payload = { userId, oldPassword, newPassword };

    return this.http.patch(url, payload);
  }


  // Get all userws
  getAllUsers(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Delete user
  deleteUser(userId: string): Observable<any> {
    const url = `${this.apiUrl}/${userId}`;
    return this.http.delete(url);
  }
  
}
