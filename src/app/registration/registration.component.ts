import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { ProblemService } from '../problem.service';

interface RegistrationResponse {
  [x: string]: any;
  message: string;
  userId: string;
  token:string;
}

// export const passwordMatchValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
//   const password = control.get('password');
//   const confirmPassword = control.get('confirmPassword');

//   if (password && confirmPassword && password.value !== confirmPassword.value) {
//     return { passwordMismatch: true };
//   }

//   return null;
// };


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  invalidForm: boolean = true;
  isClicked: boolean = false;
  error: any = null;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private problemService: ProblemService
    ) {}




  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
    },
    //{ validator: passwordMatchValidator }
    );
  }

  register() {
    if (this.registrationForm.invalid) {
      this.invalidForm = true;
      return;
    }
    if(this.registrationForm.value.password != this.registrationForm.value.confirmPassword){
      this.invalidForm = true;
      return;
    }

  const firstName = this.registrationForm.value.firstName;
  const lastName = this.registrationForm.value.lastName;
  const name = `${firstName} ${lastName}`;

  const userData = {
    ...this.registrationForm.value,
    name: name
  };


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
        if (role === 'admin') {
          this.router.navigate(['/admin'], { queryParams: { userId } });
        }else if(role === 'staff'){
          this.router.navigate(['/staff'], { queryParams: { userId } });
        }else{
          console.log("Here")
          this.router.navigate(['/user'], { queryParams: { userId } });
        }
      },
      (error) => {
        console.error('Failed to register user:', error);
        this.error = error.error.error;
        console.log(error.message);
        // Add any error handling logic here
      }
    );
  }
}
