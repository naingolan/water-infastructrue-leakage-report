import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements AfterViewInit {
  @ViewChild('myChartCanvas') myChartCanvas!: ElementRef<HTMLCanvasElement>;

  ngAfterViewInit(): void {
    this.createChart();
  }

  createChart(): void {
    const ctx = this.myChartCanvas.nativeElement.getContext('2d');
    if (ctx) {
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: ['Pending', 'On Process', 'Solved'],
          datasets: [
            {
              label: "Problem Status",
              data: [467, 576, 572],
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
