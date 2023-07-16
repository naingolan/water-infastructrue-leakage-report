import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ProblemService, Problem, ProblemKind } from '../../problem.service';
import { UserService } from '../../user.service';
import { Observable, catchError, map, of } from 'rxjs';
import { DatePipe } from '@angular/common';


//for table
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { StaffService, Staff} from 'src/app/staff.service';
declare var google: any;

@Component({
  selector: 'admin-app-problem',
  templateUrl: './app-problem.component.html',
  styleUrls: ['./app-problem.component.css'],
  providers: [DatePipe]

})
export class AdminHomeDisplayComponent implements OnInit {

  problemsDataSource: MatTableDataSource<Problem> = new MatTableDataSource<Problem>();
  awaitDataSource: MatTableDataSource<Problem> = new MatTableDataSource<Problem>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  problems$!: Observable<Problem[]>
  staffList: Staff[] = [];
  showForm: boolean = false;
  userData: any;
  problemKinds: ProblemKind[] = [];
  problemForm!: FormGroup;
  latitudeObtained!: number;
  longitudeObtained!: number;
  imageSrc!: string;
  selectedImage!: string;
  //avoiding distrubance
  problemsForUsage: Problem[] = [];
  userId= localStorage.getItem('uuid') || '';

  //about location
  latitude!: number;
  longitude!: number;
  locationInfo: string = '';
  locationData: any;

  //form
  @ViewChild('formRef') formRef!: NgForm;



  constructor(
    private formBuilder: FormBuilder,
    private problemService: ProblemService,
    private userService: UserService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router,
    private staffService: StaffService
  ) { }

  ngOnInit() {
    this.userData = this.userService.userData;
    this.fetchProblems();
    this.fetchStaff();
    this.getLocation(this.latitude, this.longitude);
    this.initForm();
  }


  fetchProblems(): void {
    this.problemService.fetchProblems().pipe(
      map((problems: Problem[]) => problems.reverse())
    ).subscribe((problems: Problem[]) => {
      console.log(problems);
      //problems = this.locationInfo;
      this.problemsDataSource.data = problems;
      this.problemsDataSource.sort = this.sort;
      this.problemsDataSource.paginator = this.paginator;

      this.awaitDataSource.data = problems.filter((problem: Problem) => problem.adminApproval === 'approved');
      this.awaitDataSource.sort = this.sort;
      this.awaitDataSource.paginator = this.paginator;
    });
  }
  // getStatusCellStyle(status: string): { [key: string]: string } {
  //   let backgroundColor = '';

  //   switch (status) {
  //     case 'pending':
  //       backgroundColor = 'lightblue !important';
  //       break;
  //     case 'onprocess':
  //       backgroundColor = 'yellow !important';
  //       break;
  //     case 'solved':
  //       backgroundColor = 'lightgreen';
  //       break;
  //     default:
  //       break;
  //   }

  //   return { 'background-color': backgroundColor };
  // }

  updateProblemSolution(problemId: string): void {
    this.staffService.updateProblemSolution(problemId, "approve").subscribe(
      (response) => {
        console.log(response);
        this.fetchProblems();
        this.fetchStaff();
      },
      (error) => {
        console.log('Error updating problem solution:', error);
      }
    );
  }

  fetchStaff(): void {
    this.staffService.getStaffList().subscribe(
      (staffList: Staff[]) => {
        this.staffList = staffList.filter((staff: Staff) => staff.staffStatus === 'available');
        console.log(staffList);
      },
      (error) => {
        console.log('Error fetching staff list:', error);
      }
    );
  }

  initForm(): void {
    this.problemForm = new FormGroup({
      assignedTo: new FormControl(null) // Initialize with null or any other default value
    });
  }

  onStaffSelectionChange(problemId: string): void {
    if (this.problemForm.valid) {
      const assignedTo = this.problemForm.get('assignedTo')?.value;
      console.log("I have get undefined" + assignedTo);
      //const staff = this.staffList.find(staff => staff.id === String(assignedTo));
      const staff = this.staffList.find(staff => staff._id === assignedTo);
      const staffId = staff?._id?.toString();
      const staffName = staff?.name;
      console.log(staffId, staffName);
      if (problemId && staffId && staffName) {
        this.staffService.assignStaff(problemId, staffId, staffName).subscribe(
          (response) => {
            console.log('Assigned staff successfully');
            this.fetchProblems();
            this.fetchStaff();
          },
          (error) => {
            console.log('Error assigning staff:', error);
          }
        );
      }
    }
    // setTimeout(() => {
    this.formRef.resetForm();
    //   window.location.reload();
    // }, 500);
  }


  addProblemLocation(): void {
    this.problemService.getLocationService().then((position) => {
      this.latitudeObtained = position.coords.latitude;
      this.longitudeObtained = position.coords.longitude;
    }).catch((err) => {
      console.log(err);
    });
  }

  // onSubmit(): void {
  //   if (this.problemForm.invalid) {
  //     return;
  //   }
  //   const reporterId = localStorage.getItem('uuid') || '';
  //   const latitude = this.latitudeObtained;
  //   const longitude = this.longitudeObtained;
  //   const imageSrc = this.imageSrc;

  //   const problem: Problem = {
  //     kind: this.problemForm.value.kind,
  //     imageSrc: imageSrc,
  //     description: this.problemForm.value.description,
  //     reporter: reporterId,
  //     latitude: latitude,
  //     longitude: longitude,
  //     adminApproval: ''
  //   };
  //   this.problemService.reportProblem(problem).subscribe(
  //     ()=>{
  //       this.fetchProblems();
  //       this.problemForm.get('image')!.setValue('');
  //       this.problemForm.reset();
  //       console.log("Imekaa sawa");
  //     },
  //     (error)=>{
  //       console.log("Bado sana");
  //     }
  //   );
  // }



  deleteProblem(problemId: string): void {
    // Perform the deletion logic here
    // You can call the appropriate service method to delete the problem
  }


  //for location
  getLocation(latitude: number, longitude: number): Observable<string> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAuC-zLWbKCbkgZ1UUBlva6iARfqaipGfU`;

    return this.http.get(url).pipe(
      map((response: any) => {
        const addressComponents = response.results[0].address_components;
        const street = this.getAddressComponent(addressComponents, 'route');
        const ward = this.getAddressComponent(addressComponents, 'sublocality');
        const district = this.getAddressComponent(addressComponents, 'locality');
        const country = this.getAddressComponent(addressComponents, 'country');
        console.log(`${street}, ${ward}, ${district}, ${country}`);
        return `${street}, ${ward}, ${district}, ${country}`;
      }),
      catchError((error: any) => {
        console.error('Error getting location:', error);
        return of('');
      })
    );
  }
  private getAddressComponent(addressComponents: any[], type: string): string {
    const component = addressComponents.find((component: any) =>
      component.types.includes(type)
    );

    return component ? component.long_name : '';
  }

  viewProblem(problemId: string): void {
    console.log("I've been clicked");
    this.router.navigate(['admin/problem', problemId]);
  }



}
