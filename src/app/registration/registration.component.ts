import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ProblemService } from '../problem.service';

interface RegistrationResponse {
  [x: string]: any;
  message: string;
  userId: string;
  token:string;
}


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private problemService: ProblemService
    ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    });
  }

  register() {
    if (this.registrationForm.invalid) {
      return;
    }

    const userData = this.registrationForm.value;
    this.http.post<RegistrationResponse>('http://localhost:3000/api/users/register', userData).subscribe(
      (response) => {
        this.userService.updateUserCreatedStatus(true);
        const token = response.token;
        localStorage.setItem('authToken', token);

        console.log('User registered successfully:', response);
        const userIdTemp = response.userId; // Access the userId from the response
        localStorage.setItem('uuid', userIdTemp);
        const userId = localStorage.getItem('uuid')??"";
        this.userService.fetchUserData(userId).subscribe(
          (userData) => {
            console.log('User data fetched successfully:', userData);
            this.userService.userData = userData; // Assign the userData to the userData property of the userService
            });
        this.problemService.fetchProblemKinds();
        const role = this.userService.getUserRole();
        console.log(role);
        if (role === 'user') {
          this.router.navigate(['/user'], { queryParams: { userId } });
        }else if(role === 'staff'){
          this.router.navigate(['/staff'], { queryParams: { userId } });
        }else{
          console.log("Here")
          this.router.navigate(['/admin'], { queryParams: { userId } });
        }
      },
      (error) => {
        console.error('Failed to register user:', error);
        // Add any error handling logic here
      }
    );
  }
}
