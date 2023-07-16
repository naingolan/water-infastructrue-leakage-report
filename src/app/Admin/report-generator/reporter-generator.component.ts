import { Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ProblemService } from 'src/app/problem.service';
import { map } from 'rxjs';
import { DatePipe, formatCurrency } from '@angular/common';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-report-generator',
  templateUrl: './reporter-generator.component.html',
  styleUrls: ['./reporter-generator.component.css'],
  providers: [DatePipe],
})
export class ReportGeneratorComponent implements OnInit {
  selectedReportType: string = 'daily';
  filteredProblems: any[] = [];
  problemsDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  displayedColumns: string[] = ['No', 'name','reportedBy', 'createdAt', 'createdTime', 'status'];

  @ViewChild('table') table!: ElementRef;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  problems!: any[];

  constructor(
    private problemService: ProblemService,
    private datePipe : DatePipe
    ) {}

  ngOnInit(): void {
    this.fetchProblems();
  }

  fetchProblems(): void {
    this.problemService.fetchProblems().pipe(
      map((response: any) => response.reverse())
    ).subscribe((problems: any[]) => {
      console.log(problems);
      this.problems = problems;
      this.problemsDataSource.data = problems;
      this.problemsDataSource.sort = this.sort;
      this.problemsDataSource.paginator = this.paginator;
    });
  }

  generateReport(): void {
    console.log(this.problems);
    const allProblems: any[] = this.problems

    switch (this.selectedReportType) {
      case 'daily':
        console.log("i have been reached");
        this.filteredProblems = allProblems.filter(problem => this.isProblemCreatedToday(problem.reportedAt));
        console.log(this.filteredProblems);
        break;
      case 'weekly':
        this.filteredProblems = allProblems.filter(problem => this.isProblemCreatedThisWeek(problem.reportedAt));
        break;
      case 'monthly':
        this.filteredProblems = allProblems.filter(problem => this.isProblemCreatedThisMonth(problem.reportedAt));
        break;
    }

    this.problemsDataSource.data = this.filteredProblems;
  }

  isProblemCreatedToday(createdAt: string): boolean {
    console.log("Even here");
    const today = new Date().toISOString().substr(0, 10);
    console.log(today);
    const formattedCreatedAt = this.datePipe.transform(createdAt, 'yyyy-MM-dd');
    console.log(formattedCreatedAt);
    return formattedCreatedAt === today;
  }

  isProblemCreatedThisWeek(createdAt: string): boolean {
    const today = new Date();
    const problemDate = new Date(createdAt);
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
    const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + (6 - today.getDay()));
    return problemDate >= startOfWeek && problemDate <= endOfWeek;
  }


  isProblemCreatedThisMonth(createdAt: string): boolean {
    const today = new Date();
    const problemDate = new Date(createdAt);

    return problemDate.getMonth() === today.getMonth() && problemDate.getFullYear() === today.getFullYear();
  }


  generatePDF(): void {
    const doc = new jsPDF();
    const table = this.table.nativeElement;

    html2canvas(table).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = doc.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      doc.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      doc.save('report.pdf');
    });
  }


}
