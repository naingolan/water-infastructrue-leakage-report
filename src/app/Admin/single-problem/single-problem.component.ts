import { Component } from '@angular/core';
import { ProblemService, Problem } from '../../problem.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'admin-app-single-problem',
  templateUrl: './single-problem.component.html',
  styleUrls: ['./single-problem.component.css']
})
export class AdminSingleProblemComponent {
  problem!: Problem;
  problemId!: number;

  constructor(
    private problemService: ProblemService,
    private route: ActivatedRoute
  ) { }
  ngOnInit(){
    this.route.params.subscribe(params => {
      this.problemId = params['id'];
      this.fetchProblemById(this.problemId);
    });

  }

  fetchProblemById(problemId:number): void {
    this.problemService.fetchProblemById(problemId)
      .subscribe((problem: Problem) => {
        this.problem = problem;
      });
  }


}
