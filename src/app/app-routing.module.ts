import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { HomeComponent } from './home/home.component';
import { RegistrationComponent } from './registration/registration.component';
import { LoginComponent } from './login/login.component';
import { SingleProblemComponent } from './User/single-problem/single-problem.component';
import { HomeDisplayComponent } from './User/problem/app-problem.component';
import { StaffAuthService } from './auth/staff-auth.service';
import { AdminAuthService } from './auth/admin-auth.service';
import { UserAuthService } from './auth/user-auth.service';
import { UserComponent } from './User/home/home.component';
import { AdminComponent } from './Admin/home/home.component';
import { AdminHomeDisplayComponent } from './Admin/problem/app-problem.component';
import { AdminSingleProblemComponent } from './Admin/single-problem/single-problem.component';
import { StaffComponent } from './Staff/staff/home.component';
import { StaffProblemsComponent } from './Staff/problem/app-problem.component';
import { StaffSingleProblemComponent } from './Staff/single-problem/single-problem.component';
import { DashboardComponent } from './User/dashboard/dashboard.component';

const routes: Routes = [
   { path: 'login', component: LoginComponent },
   { path: 'registration', component: RegistrationComponent},
  //  {
  //   path: 'home',
  //   component: HomeComponent,
  //   children: [
  //     { path: 'problem', component: HomeDisplayComponent},
  //     { path: 'problem/:id', component: SingleProblemComponent},
  //    { path: '', redirectTo: 'problem', pathMatch: 'full'}
  //   ]
  //   },
    //Path for user
   {  path: 'user',
      component: UserComponent,
      //canActivate: [UserAuthService],
      children: [
        { path: 'problem', component: HomeDisplayComponent},
        { path: 'problem/:id', component: SingleProblemComponent},
        { path: 'dashboard', component: DashboardComponent},
        { path: '', redirectTo: 'dashboard', pathMatch: 'full'}
      ]
    },
    //path for admin
    {  path: 'admin',
    component: AdminComponent,
    //canActivate: [UserAuthService],
    children: [
      { path: 'problem', component: AdminHomeDisplayComponent},
      { path: 'problem/:id', component: AdminSingleProblemComponent},
      { path: '', redirectTo: 'problem', pathMatch: 'full'}
    ]
    },
    //path for staff
   { path: 'staff',
     component: StaffComponent,
     //canActivate: [StaffAuthService],
     children: [
      { path: 'problem', component: StaffProblemsComponent},
      { path: 'problem/:id', component: StaffSingleProblemComponent},
      { path: '', redirectTo: 'problem', pathMatch: 'full'}
     ]
    },
   { path: '', redirectTo: 'login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
