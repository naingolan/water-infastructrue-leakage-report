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
import { ReactiveFormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';




import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { HomeDisplayComponent } from './problem/app-problem.component';
import { ProblemDialogComponent } from './problem-dialog/problem-dialog.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { UserService } from './user.service';
import { ProblemLocationComponent } from './problem-location/problem-location.component';
import { ProblemFormComponent } from './problem-form/problem-form.component';
import { MatRadioModule } from '@angular/material/radio';
import { TokenInterceptor } from './token.interceptor';
import { MatSelectModule } from '@angular/material/select';
import { ProblemDisplayComponent } from './problem-display/problem-display.component';

import { ChangeDetectorRef } from '@angular/core';
import { ProblemService } from './problem.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HomeDisplayComponent,
    ProblemDialogComponent,
    RegistrationComponent,
    LoginComponent,
    ProblemLocationComponent,
    ProblemFormComponent,
    ProblemDisplayComponent
  ],
  imports: [
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
    MatRadioModule
  ],
  providers: [
    //{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }
    ProblemService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
