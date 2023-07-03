import { Component } from '@angular/core';
import { ProblemService, Problem } from '../../problem.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaffService } from 'src/app/staff.service';

@Component({
  selector: 'app-single-problem',
  templateUrl: './single-problem.component.html',
  styleUrls: ['./single-problem.component.css']
})
export class StaffSingleProblemComponent {
  problem!: Problem;
  problemId!: number;
  problemForm!: FormGroup;

  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private staffService: StaffService,
  ) { }
  ngOnInit(){
    this.route.params.subscribe(params => {
      this.problemId = params['id'];
      this.fetchProblemById(this.problemId);
      this.initProblemForm();
    });

  }

  fetchProblemById(problemId:number): void {
    this.problemService.fetchProblemById(problemId)
      .subscribe((problem: Problem) => {
        this.problem = problem;
      });
  }

  initProblemForm() {
    this.problemForm = this.formBuilder.group({
      status: ['', Validators.required],
      staffFeedback: ['']
    });
  }

  onSubmit() {
    if (this.problemForm.invalid) {
      return;
    }

    const { status, staffFeedback } = this.problemForm.value;

    this.staffService.updateProblemStatus('', status, staffFeedback)
      .subscribe(
        response => {
          console.log('Problem status updated successfully');
          this.problemForm.reset();
        },
        error => {
          console.error('Error updating problem status:', error);
        }
      );
  }

}
