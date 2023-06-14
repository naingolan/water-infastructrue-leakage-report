import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProblemService, Problem, ProblemKind } from '../problem.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-problem-form',
  templateUrl: './problem-form.component.html',
  styleUrls: ['./problem-form.component.css']
})
export class ProblemFormComponent implements OnInit {
  @Output() formSubmitted: EventEmitter<void> = new EventEmitter<void>();
  problemForm!: FormGroup ;
  problemKinds!: ProblemKind[];
  latitudeObtained!: number;
  longitudeObtained!: number;
  imageSrc!: string;
  selectedImage!: string;
required: any;

  constructor(
    private formBuilder: FormBuilder,
    private problemService: ProblemService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.fetchProblemKinds();
  }

  initForm(): void {
    this.problemForm = this.formBuilder.group({
      kind: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  fetchProblemKinds(): void {
    this.problemService.getProblemKinds().subscribe(
      (kinds: ProblemKind[]) => {
        this.problemKinds = kinds;
        console.log(kinds);
      },
      (error: any) => {
        console.log('Error fetching problem kinds:', error);
      }
    );
  }
  
  onSelectionChange(): void {
    const select = document.querySelector('mat-select');
    if (select) {
      select.dispatchEvent(new Event('click'));
    }
  }
  

  onKindSelectionChange(selectedValue: string): void {
    const kindControl = this.problemForm.get('kind');
    kindControl!.setValue(selectedValue);
  }
  

  addProblemLocation():void{
    this.problemService.getLocationService().then((position)=>{
        this.latitudeObtained = position.coords.latitude;
        this.longitudeObtained = position.coords.longitude;
      console.log(position)
    }).catch((err)=>{ 
      console.log(err)
    })
  }

  //when  user has inserted image
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
  
    const reporterId = this.userService.userData.id;
    const latitude = this.latitudeObtained; 
    const longitude = this.longitudeObtained; 
    const imageSrc = this.imageSrc
  
    const problem: Problem = {
      kind: this.problemForm.value.name,
      imageSrc: imageSrc ,
      description: this.problemForm.value.description,
      reporter: reporterId,
      latitude: latitude, // Assign latitude value to the problem object
      longitude: longitude, // Assign longitude value to the problem object
    };
  
    this.problemService.reportProblem(problem).subscribe(
      (createdProblem: Problem) => {
        console.log('Problem created:', createdProblem);
        // Handle success, redirect, or perform other actions
      },
      (error: any) => {
        console.log('Error creating problem:', error);
        // Handle error appropriately
      }
    );
    this.formSubmitted.emit();
  }
  
}
