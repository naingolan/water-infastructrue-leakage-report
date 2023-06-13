import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';

interface LoginResponse {
  message: string;
  userId: string;
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
      username: ['', Validators.required],
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
    // Replace the URL with your login endpoint
    this.http.post<LoginResponse>('http://localhost:3000/api/users/login', loginData).subscribe(
      (response) => {
        console.log('User logged in successfully:', response);
        const userId = response.userId; // Access the userId from the response
        localStorage.setItem('uuid', userId);
        this.userService.fetchUserData(userId).subscribe(
          (userData) => {
            console.log('User data fetched successfully:', userData);
            // Store user data in the service or local storage for access across components
            this.userService.userData = userData; // Assign the userData to the userData property of the userService
          }
        );
        this.router.navigate(['/home'], { queryParams: { userId } }); // Pass the userId as a query parameter to the home route
      },
      (error) => {
        console.error('Failed to login:', error);
        // Add any error handling logic here
      }
    );
  }
}
