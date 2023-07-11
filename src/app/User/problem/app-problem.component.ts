import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProblemService, Problem, ProblemKind } from '../../problem.service';
import { UserService } from '../../user.service';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { DatePipe } from '@angular/common';


//for table
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
declare var google: any;

@Component({
  selector: 'app-problem',
  templateUrl: './app-problem.component.html',
  styleUrls: ['./app-problem.component.css'],
  providers: [DatePipe]

})
export class HomeDisplayComponent implements OnInit {

  problemsDataSource: MatTableDataSource<Problem> = new MatTableDataSource<Problem>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  problems$!: Observable<Problem[]>
  showForm: boolean = true;
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



  constructor(
    private formBuilder: FormBuilder,
    private problemService: ProblemService,
    private userService: UserService,
    private datePipe: DatePipe,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.userData = this.userService.userData;
    this.initForm();
    this.fetchProblemKinds();
    this.fetchProblems();
    this.addProblemLocation();
  }

  initForm(): void {
    this.problemForm = this.formBuilder.group({
      kind: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  handleImageInput(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.problemForm.controls['image'].setValue(reader.result);
      };
    }
  }
  road! : any;
  remedyFunction(latitude:number, longitude:number):void{
  this.getLocation(latitude, longitude).subscribe(
    (response: any) => {
      this.road = response.results[1].formatted_address
    },
    (error)=>{
      console.log("Currectly we ar unable to fetch the map");
    });
  }

  fetchProblems(): void {
    const userId = localStorage.getItem('uuid')?.toString();
    if(userId){
    this.problemService.fetchProblemsById(userId).pipe(
      map((problems: Problem[]) => problems.reverse())
    ).subscribe((problems: Problem[]) => {
      //problems = this.locationInfo;
      this.problemsDataSource.data = problems;
      this.problemsDataSource.sort = this.sort;
      this.problemsDataSource.paginator = this.paginator;
    });
   }
  }



  fetchProblemKinds(): void {
    this.problemService.fetchProblemKinds().subscribe(
      (kinds: ProblemKind[]) => {
        this.problemKinds = kinds;
      },
      (error) => {
        console.log('Error fetching problem kinds:', error);
      }
    );
  }

  onKindSelectionChange(selectedValue: string): void {
    const kindControl = this.problemForm.get('kind');
    kindControl!.setValue(selectedValue);
  }

  // addProblemLocation(): void {
  //   if (navigator.geolocation) {
  //     navigator.geolocation.getCurrentPosition(
  //       (position) => {
  //         console.log(position);
  //         this.latitudeObtained = position.coords.latitude;
  //         this.longitudeObtained = position.coords.longitude;
  //       },
  //       (error) => {
  //         console.log('Error occurred while retrieving location:', error);
  //       }
  //     );
  //   } else {
  //     console.log('Geolocation is not supported by this browser.');
  //   }
  // }

  addProblemLocation(): void {
    const options = {
      enableHighAccuracy: true
    };
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position);
        this.latitudeObtained = position.coords.latitude;
        this.longitudeObtained = position.coords.longitude;
        this.remedyFunction(this.latitudeObtained, this.longitudeObtained);
  
      },
      (error) => {
        console.log('Error occurred while retrieving location:', error);
      },
      options
    );
  }
  
  
  onImageChange(event: any): void {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.selectedImage = reader.result as string;
      this.imageSrc = reader.result as string;
      this.problemForm.patchValue({
        image: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  onSubmit(): void {
    if (this.problemForm.invalid) {
      return;
    }
    const reporterId = localStorage.getItem('uuid') || '';
    const latitude = this.latitudeObtained;
    const longitude = this.longitudeObtained;
    const imageSrc = this.imageSrc;

    this.getLocation(this.latitudeObtained, this.longitudeObtained);

    const problem: Problem = {
      kind: this.problemForm.value.kind,
      imageSrc: imageSrc,
      description: this.problemForm.value.description,
      reporter: reporterId,
      latitude: latitude,
      longitude: longitude,
      location: this.road
    };
    this.problemService.reportProblem(problem).subscribe(
      ()=>{
        this.fetchProblems();
        this.problemForm.get('image')!.setValue('');
        this.problemForm.reset();
        console.log("Imekaa sawa");
      },
      (error)=>{
        console.log("Bado sana");
      }
    );
  }



  deleteProblem(problemId: string): void {
    this.problemService.deleteProblem(problemId).subscribe(
      () => {
        console.log('Problem deleted successfully');
        this.fetchProblems();
      },
      (error: any) => {
        console.error('Error deleting problem:', error);
      }
    );
  }


//Here i am stopping you for short time

  // getLocation(latitude: number, longitude: number): Observable<any> {
  //   const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAuC-zLWbKCbkgZ1UUBlva6iARfqaipGfU`;
  //     return this.http.get(url).pipe(
  //     catchError((error: any) => {
  //       console.error('Error getting location:', error);
  //       return of('');
  //     })
  //   );
  // }
  


  
  getLocation(latitude: number, longitude: number): Observable<string> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAuC-zLWbKCbkgZ1UUBlva6iARfqaipGfU`;
    console.log("You are here again");
    console.log(latitude, longitude);
    
    return this.http.get(url).pipe(
      tap((response: any) => {
        console.log(response);
        if (response.status === 200) {
          console.log(AuthenticatorResponse)
          const addressComponents = response.results[0].address_components;
          const street = this.getAddressComponent(addressComponents, 'route');
          const ward = this.getAddressComponent(addressComponents, 'sublocality');
          const district = this.getAddressComponent(addressComponents, 'locality');
          const country = this.getAddressComponent(addressComponents, 'country');
          console.log("And also here");
          console.log(street, ward, district, country);
          return `${street}, ${ward}, ${district}, ${country}`;
        } else {
          return '';
        }
      }),
      catchError((error: any) => {
        console.error('Error getting location:', error);
        return of('');
      })
    );
  }
  getAddressComponent(addressComponents: any[], type: string): string {
    for (const addressComponent of addressComponents) {
      if (addressComponent.types.includes(type)) {
        return addressComponent.long_name;
      }
    }
    return '';
  }


  viewProblem(problemId: string): void {
    console.log("I've been clicked");
    this.router.navigate(['user/problem', problemId]);
  }


  removeFirstWord(address: string): string {
    const commaIndex = address.indexOf(',');
    if (commaIndex !== -1) {
      return address.substring(commaIndex + 1).trim();
    }
    return address;
  }

}
