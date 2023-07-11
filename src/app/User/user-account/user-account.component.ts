import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswrordDialogComponent } from '../change-passwrord-dialog/change-passwrord-dialog.component';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.css']
})
export class UserAccountComponent {
  constructor(private dialog: MatDialog) { }

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


}
