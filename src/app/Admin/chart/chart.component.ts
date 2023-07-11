import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';
import { map } from 'rxjs';
import { Problem, ProblemService } from 'src/app/problem.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('myChartCanvas') myChartCanvas!: ElementRef<HTMLCanvasElement>;
  pending!: number;
  onProcess!: number;
  solved!: number;
  constructor(
    private problemService: ProblemService,
    
  ){

  }
  ngAfterViewInit(): void {
    this.fetchProblems()
  }


  fetchProblems(): void {
    this.problemService.fetchProblems().pipe(
      map((problems: Problem[]) => problems.reverse())
    ).subscribe((problems: Problem[]) => {
      this.pending = problems.filter((problem: Problem) => problem.status === 'pending').length;
      this.onProcess = problems.filter((problem: Problem) => problem.status === 'on process').length;
      this.solved = problems.filter((problem: Problem) => problem.status === 'solved').length;
      this.createChart(this.pending, this.onProcess, this.solved)
    });
  }

  createChart(pending:number, onProcess:number, solved:number): void {
    const ctx = this.myChartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Pending', 'On Process', 'Solved'],
          datasets: [
            {
              label: "Problem Status",
              data: [pending, onProcess, solved],
              backgroundColor: ['orange', 'yellow', 'green']
            }
          ]
        },
        options: {
          aspectRatio: 2.5
        }
      });
    }
  }
  }
