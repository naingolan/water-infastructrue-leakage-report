import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswrordDialogComponent } from '../../User/change-passwrord-dialog/change-passwrord-dialog.component';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-staff-account',
  templateUrl: './staff-account.component.html',
  styleUrls: ['./staff-account.component.css']
})
export class StaffAccountComponent {
  user: any;
  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    ) { }

    ngOnInit(): void {
      this.fetchUserData();
    }
  openChangePasswordDialog(): void {
    const dialogRef = this.dialog.open(ChangePasswrordDialogComponent, {
      width: '600px',
      height:'400px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Dialog result:', result);
    });
  }

    // Get the stored user data
    fetchUserData() {
      const userId = localStorage.getItem('uuid') || '';
      if(userId){
      this.userService.fetchUserData(userId).subscribe(
        (response) => {
          this.user = response;
          console.log('User data fetched successfully:', this.user);
        },
        (error) => {
          console.error('Failed to fetch user data:', error);
        }
      );
      }
    }


}
