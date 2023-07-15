import { Component, OnInit } from '@angular/core';
import { Staff } from '../../staff.service';
import { StaffService } from '../../staff.service';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-problem-display',
  templateUrl: './problem-display.component.html',
  styleUrls: ['./problem-display.component.css']
})
export class ProblemDisplayComponent implements OnInit {
  staffList$!: Observable<Staff[]>;
  staffForm: any;

  constructor(private fb: FormBuilder, private staffService: StaffService) {}

  ngOnInit() {
    this.initStaffForm();
    this.fetchStaffList();
  }

  initStaffForm() {
    this.staffForm = this.fb.group({
      name: ['', Validators.required],
      position: ['', Validators.required],
      department: ['', Validators.required],
      salary: [0, Validators.required]
    });
  }

  fetchStaffList() {
    this.staffList$ = this.staffService.getStaffList();
  }

  addStaff() {
    if (this.staffForm.valid) {
      const newStaff: Staff = {
        name: this.staffForm.value.name,
        position: this.staffForm.value.position,
        department: this.staffForm.value.department,
        salary: this.staffForm.value.salary,
        staffStatus: 'available',
      };
      console.log(newStaff);
      this.staffService.createStaff(newStaff).subscribe(
        () => {
          this.fetchStaffList(); // Refresh the staff list after adding a new staff
          this.staffForm.reset();
          console.log('Staff created successfully.'); // Success message
        },
        (error) => {
          console.log('Error creating staff:', error); // Error message
        }
      );
    }
  }
}
