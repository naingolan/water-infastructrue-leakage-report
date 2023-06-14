import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProblemService, Problem } from '../problem.service';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-problem',
  templateUrl: './app-problem.component.html',
  styleUrls: ['./app-problem.component.css']
})
export class HomeDisplayComponent implements OnInit {

  problems: Problem[] = [];
  problemForm!: FormGroup;
  showForm: boolean = false;
  userData: any;

  constructor(
    private formBuilder: FormBuilder, 
    private problemService: ProblemService,
    private userService: UserService,
    private http:HttpClient
    ) { }

  ngOnInit() {
    //this.problems = this.problemService.problems;
    this.userData = this.userService.userData;
    console.log(this.userData)
    this.initializeForm();

    this.reverseGeocode(-6.8059136, 39.2462336).subscribe((result: any) => {
      console.log(result)
    });
  }

  reverseGeocode(latitude: number, longitude: number) {
    const apiKey = 'AIzaSyAuC-zLWbKCbkgZ1UUBlva6iARfqaipGfU'; // Replace with your Google Maps Geocoding API key
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  
    return this.http.get(url).pipe(
      catchError((error) => {
        console.log('Error occurred during reverse geocoding:', error);
        return [];
      })
    );
  }
  


  initializeForm() {
    this.problemForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      reporter: ['', Validators.required],
      imageSrc: ['', Validators.required],
      status: ['Pending']
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }
  onFormSubmitted() {
    this.showForm = !this.showForm;
  }
  // addProblem() {
  //   if (this.problemForm.valid) {
  //     const newProblem: Problem = {
  //       // id: this.problems.length + 1,
  //       // name: this.problemForm.value.name,
  //       // location: this.problemForm.value.location,
  //       // reporter: this.problemForm.value.reporter,
  //       // imageSrc: this.problemForm.value.imageSrc,
  //       // status: this.problemForm.value.status,
  //       // description: ''
  //     };
  //     this.problemsService.problems.push(newProblem);
  //     this.problemForm.reset();
  //     this.toggleForm();
  //   } else {
  //     // Handle form validation errors if needed
  //   }
  // }
  handleImageInput(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.problemForm.controls['imageSrc'].setValue(reader.result);
      };
    }
  }
  
  
}
