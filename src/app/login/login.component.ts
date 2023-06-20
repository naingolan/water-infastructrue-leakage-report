import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

interface LoginResponse {
  message: string;
  userId: string;
  token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  login() {
    if (this.loginForm.invalid) {
      // Form validation failed, handle the error
      return;
    }

    const loginData = this.loginForm.value;
    console.log(loginData);
    // Make the HTTP request to perform the login
    this.http.post<LoginResponse>('http://localhost:3000/api/users/login', loginData).subscribe(
      (response) => {
        console.log('User logged in successfully:', response);
        const userId = response.userId;
        const authToken = response.token;

        localStorage.setItem('uuid', userId);
        localStorage.setItem('authToken', authToken);

        this.userService.fetchUserData(userId).subscribe(
          (userData) => {
            console.log('User data fetched successfully:', userData);
            // Store user data in the service
            this.userService.userData = userData; // Assign the userData to the userData property of the userService
          }
        );
        const role = this.userService.getUserRole();
        console.log(role);
        if (role === 'user') {
          this.router.navigate(['/user'], { queryParams: { userId } });
        }else if(role === 'staff'){
          this.router.navigate(['/staff'], { queryParams: { userId } });
        }else{
          this.router.navigate(['/admin'], { queryParams: { userId } });
        }
      },
      (error) => {
        console.log(error);
        console.error('Failed to login:', error);
        // Add any error handling logic here
      }
    );
  }
}
