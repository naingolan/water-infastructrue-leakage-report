import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm!: FormGroup;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  changePassword() {
    if (this.changePasswordForm.invalid) {
      return;
    }

    const { email, password, confirmPassword } = this.changePasswordForm.value;

    if (password !== confirmPassword) {
      this.error = 'Passwords do not match';
      return;
    }

    const payload = { email, password };
    console.log(payload);
    // Call your API endpoint to update the password
    const apiUrl = 'http://localhost:3000/api/users/update/staff/password'; // Replace with your API endpoint URL
    this.http.patch(apiUrl, payload).subscribe(
      () => {
        // Password updated successfully
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Failed to update password:', error);
        this.error = 'Failed to update password. Please try again.';
      }
    );
  }
}
