import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-change-passwrord-dialog',
  templateUrl: './change-passwrord-dialog.component.html',
  styleUrls: ['./change-passwrord-dialog.component.css']
})
export class ChangePasswrordDialogComponent {

  changePasswordForm: FormGroup;
  oldPassword: any;
  newPassword: any;
  confirmPassword: any;

  constructor(
    public dialogRef: MatDialogRef<ChangePasswrordDialogComponent>,
    private formBuilder: FormBuilder,
    private userService: UserService,
    ) {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required],
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  changePasswordFormSubmit(): void {
    console.log('Form Submitted');
    if (this.confirmPassword===this.newPassword) {

      const oldPassword = this.oldPassword;
      const newPassword = this.newPassword;
      const confirmPassword = this.confirmPassword;

      const userId = localStorage.getItem('uuid')?.toString()
      if(userId){
      this.userService.changePassword(userId, oldPassword, newPassword).subscribe(
        (response) => {
          console.log('Password changed successfully:', response);
          this.dialogRef.close();
        },
        (error) => {
          console.log('Error changing password:', error);

        }
      );
      }
    }
  }

  }


