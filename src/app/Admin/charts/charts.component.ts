import { Component, AfterViewInit } from '@angular/core';
import * as CanvasJS from 'canvasjs';


@Component({
  selector: 'app-charts',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.css']
})
export class ChartComponent implements AfterViewInit {

  ngAfterViewInit() {
    const chart = new CanvasJS.Chart("myChart", {
      title: {
        text: "My Pie Chart"
      },
      data: [{
        type: "pie",
        dataPoints: [
          { y: 300, label: "Data Point 1" },
          { y: 500, label: "Data Point 2" },
          { y: 100, label: "Data Point 3" }
        ]
      }]
    });

    chart.render();
  }
}
