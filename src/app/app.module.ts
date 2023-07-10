import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { MatSliderModule } from '@angular/material/slider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeDisplayComponent } from './User/problem/app-problem.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './user.service';
import { ProblemLocationComponent } from './User/problem-location/problem-location.component';
import { MatRadioModule } from '@angular/material/radio';
import { TokenInterceptor } from './token.interceptor';
import { MatSelectModule } from '@angular/material/select';
import { ProblemDisplayComponent } from './User/problem-display/problem-display.component';

import { ChangeDetectorRef } from '@angular/core';
import { ProblemService } from './problem.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { SingleProblemComponent } from './User/single-problem/single-problem.component';
import { UserComponent } from './User/home/home.component';
//Admin Imports
import { AdminComponent } from './Admin/home/home.component';
import { AdminSingleProblemComponent } from './Admin/single-problem/single-problem.component';
import { AdminProblemDisplayComponent } from './Admin/problem-display/problem-display.component';
import { AdminProblemLocationComponent } from './Admin/problem-location/problem-location.component';
import { AdminHomeDisplayComponent } from './Admin/problem/app-problem.component';

//Staff Imports
import { StaffComponent } from './Staff/staff/home.component';
import { StaffProblemsComponent } from './Staff/problem/app-problem.component';
import { StaffSingleProblemComponent } from './Staff/single-problem/single-problem.component';

import { DashboardComponent } from './User/dashboard/dashboard.component';
import { AnouncementComponent } from './Admin/anouncement/anouncement.component';
import { ChartComponent } from './Admin/chart/chart.component';
import { StaffListComponent } from './Admin/staff-list/staff-list.component';
import { MessagesComponent } from './User/messages/messages.component';
import { ReportGeneratorComponent } from './Admin/report-generator/reporter-generator.component';
import { UserAnouncementComponent } from './User/user-anouncements/user-anouncements.component';



@NgModule({
  declarations: [
    AppComponent,
    //These are for the suer
    UserComponent,
    //These are for the admin
    AdminComponent,
    AdminHomeDisplayComponent,
    AdminSingleProblemComponent,
    AdminProblemDisplayComponent,
    AdminProblemLocationComponent,
    //These are for staff
    StaffComponent,
    StaffProblemsComponent,
    StaffSingleProblemComponent,
    //These are for the normal user
    HomeDisplayComponent,
    RegistrationComponent,
    LoginComponent,
    ProblemLocationComponent,
    ProblemDisplayComponent,
    SingleProblemComponent,
    DashboardComponent,
    AnouncementComponent,
    ChartComponent,
    StaffListComponent,
    MessagesComponent,
    ReportGeneratorComponent,
    UserAnouncementComponent
  ],
  imports: [
    FormsModule,
    MatSelectModule,
    HttpClientModule,
    MatListModule,
    MatMenuModule,
    BrowserModule,
    AppRoutingModule,
    MatSidenavModule,
    BrowserAnimationsModule,
    MatSliderModule,
    MatToolbarModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule
  ],
  providers: [
    //{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ProblemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
