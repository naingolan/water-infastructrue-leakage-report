import { Component, OnInit } from '@angular/core';
import { ProblemService } from '../problem.service';
import { Problem } from '../problem.service';



@Component({
  selector: 'app-problem-display',
  templateUrl: './problem-display.component.html',
  styleUrls: ['./problem-display.component.css']
})
export class ProblemDisplayComponent implements OnInit {
  problems: Problem[] = [];

  constructor(private problemService: ProblemService) { }

  ngOnInit(): void {

    this.fetchProblems();
  }

  fetchProblems(): void {
    this.problemService.fetchProblems().subscribe(
      (problems: Problem[]) => {
        this.problems = problems.reverse();
        console.log(this.problems);
      },
      (error: any) => {
        console.log('Error fetching problems:', error);
      }
    );
  }
}
