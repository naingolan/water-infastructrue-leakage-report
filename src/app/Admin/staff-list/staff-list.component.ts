import { Component, OnInit } from '@angular/core';
import { StaffService } from '../../staff.service';
import { MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/user.service';

@Component({
  selector: 'app-staff-list',
  templateUrl: './staff-list.component.html',
  styleUrls: ['./staff-list.component.css']
})
export class StaffListComponent implements OnInit {
  staffList: any[] = [];
  newStaff: any = {};
  integer: number = 1;
  displayedColumns: string[] = ['no', 'name', 'email', 'phoneNumber', 'actions'];
  formErrors: any;
  dataSource = new MatTableDataSource<any>([])


  constructor(
    private staffService: StaffService,
    private userService: UserService
    ) {}

  ngOnInit(): void {
    this.loadStaffList();
  }


  loadStaffList(): void {
    this.staffService.getStaffList().subscribe(
      (response: any) => {
        console.log(response);
        this.dataSource.data = response; // Assign the response to the data source
        //console.log(this.dataSource.data);
      },
      (error: any) => {
        console.log('Error loading staff list:', error);
      }
    );
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(
      (response) => {
        console.log('User deleted successfully:', response);
        this.loadStaffList();
      } ,
      (error) => {
        console.log('Error deleting user:', error);
      }
    );
    }


  createStaff(): void {
    // Set default values for password and role
    this.newStaff.password = '1234';
    this.newStaff.role = 'staff';

    // Concatenate first name and last name
    this.newStaff.name = this.newStaff.firstName + ' ' + this.newStaff.lastName;

    this.staffService.createStaff(this.newStaff).subscribe(
      (response: any) => {
        console.log('Staff created successfully:', response);
        this.newStaff = {}; // Clear the form input values
        this.loadStaffList(); // Refresh the staff list
      },
      (error: any) => {
        console.log('Error creating staff:', error);
        this.formErrors.email = error.error.message;

      }
    );
  }

  deleteStaff(staffId: string): void {
    this.staffService.deleteStaff(staffId).subscribe(
      () => {
        console.log('Staff deleted successfully');
        this.loadStaffList(); // Refresh the staff list
      },
      (error: any) => {
        console.log('Error deleting staff:', error);
      }
    );
  }

  editStaff(staffId: string): void {
    // Implement the edit functionality as per your requirements
  }
}
