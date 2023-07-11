import { Component } from '@angular/core';
import { ProblemService, Problem } from '../../problem.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-single-problem',
  templateUrl: './single-problem.component.html',
  styleUrls: ['./single-problem.component.css']
})
export class SingleProblemComponent {
  problem!: Problem;
  problemId!: String;

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

  fetchProblemById(problemId:String): void {
    console.log(problemId);
    this.problemService.fetchProblemById(problemId)
      .subscribe((response) => {
        console.log(response);
        this.problem = response;
      });
  }


}
