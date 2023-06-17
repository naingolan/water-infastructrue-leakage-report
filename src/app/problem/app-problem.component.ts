import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProblemService, Problem, ProblemKind } from '../problem.service';
import { UserService } from '../user.service';
import { Observable, map } from 'rxjs';
import { DatePipe } from '@angular/common';


//for table
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { HttpClient } from '@angular/common/http';
declare var google: any;

@Component({
  selector: 'app-problem',
  templateUrl: './app-problem.component.html',
  styleUrls: ['./app-problem.component.css'],
  providers: [DatePipe]

})
export class HomeDisplayComponent implements OnInit {
viewProblem(arg0: any) {
throw new Error('Method not implemented.');
}
  problemsDataSource: MatTableDataSource<Problem> = new MatTableDataSource<Problem>();
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  problems$!: Observable<Problem[]>
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



  constructor(
    private formBuilder: FormBuilder,
    private problemService: ProblemService,
    private userService: UserService,
    private datePipe: DatePipe,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.userData = this.userService.userData;
    this.initForm();
    this.fetchProblemKinds();
    this.fetchProblems();
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

  fetchProblems(): void {
    this.problemService.fetchProblems().pipe(
      map((problems: Problem[]) => problems.reverse())
    ).subscribe((problems: Problem[]) => {
      //problems = this.locationInfo;
      this.problemsDataSource.data = problems;
      this.problemsDataSource.sort = this.sort;
      this.problemsDataSource.paginator = this.paginator;
    });
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

  addProblemLocation(): void {
    this.problemService.getLocationService().then((position) => {
      this.latitudeObtained = position.coords.latitude;
      this.longitudeObtained = position.coords.longitude;
    }).catch((err) => {
      console.log(err);
    });
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

    const problem: Problem = {
      kind: this.problemForm.value.kind,
      imageSrc: imageSrc,
      description: this.problemForm.value.description,
      reporter: reporterId,
      latitude: latitude,
      longitude: longitude,
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
    // Perform the deletion logic here
    // You can call the appropriate service method to delete the problem
  }


  //for location
  getLocation(latitude: number, longitude: number): Promise<string> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAuC-zLWbKCbkgZ1UUBlva6iARfqaipGfU`;
    
    return this.http.get(url)
      .toPromise()
      .then((response: any) => {
        const addressComponents = response.results[0].address_components;
        const street = this.getAddressComponent(addressComponents, 'route');
        const ward = this.getAddressComponent(addressComponents, 'sublocality');
        const district = this.getAddressComponent(addressComponents, 'locality');
        const country = this.getAddressComponent(addressComponents, 'country');

        return `${street}, ${ward}, ${district}, ${country}`;
      })
      .catch((error: any) => {
        console.error('Error getting location:', error);
        return '';
      });
  }

  private getAddressComponent(addressComponents: any[], type: string): string {
    const component = addressComponents.find((component: any) =>
      component.types.includes(type)
    );

    return component ? component.long_name : '';
  }

}
