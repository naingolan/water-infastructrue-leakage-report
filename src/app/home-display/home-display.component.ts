import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProblemsService, Problem } from '../problems.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home-display',
  templateUrl: './home-display.component.html',
  styleUrls: ['./home-display.component.css']
})
export class HomeDisplayComponent implements OnInit {
  problems: Problem[] = [];
  problemForm!: FormGroup;
  showForm: boolean = false;
  userData: any;

  constructor(
    private formBuilder: FormBuilder, 
    private problemsService: ProblemsService,
    private userService: UserService
    ) { }

  ngOnInit() {
    this.problems = this.problemsService.problems;
    this.userData = this.userService.userData;
    console.log(this.userData)
    this.initializeForm();
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

  addProblem() {
    if (this.problemForm.valid) {
      const newProblem: Problem = {
        id: this.problems.length + 1,
        name: this.problemForm.value.name,
        location: this.problemForm.value.location,
        reporter: this.problemForm.value.reporter,
        imageSrc: this.problemForm.value.imageSrc,
        status: this.problemForm.value.status,
        description: ''
      };
      this.problemsService.problems.push(newProblem);
      this.problemForm.reset();
      this.toggleForm();
    } else {
      // Handle form validation errors if needed
    }
  }
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
