import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import { MatSidenav } from '@angular/material/sidenav';


// import { LanguageService } from './language-service.service';
// import { UserService } from './user.service';
import { Router } from '@angular/router';
import { UserService } from '../../user.service';

@Component({
  selector: 'admin-app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  title = 'water-infastructure managemenent system';
  @ViewChild('sidenav') sidenav!: MatSidenav;
  isSmallScreen: boolean | undefined;
  isScreenSmall: boolean | undefined;

  // My variables used here
  homeText!: string;
  reportText!: string;
  receiptText!: string;
  invoiceText!: string;
  VFDAccountsText!: string;
  profileText!: string;
  adminDashboardText!: string;
  isLoggedIn: any;

  constructor(
    private breakpointObserver: BreakpointObserver,
    // private languageService: LanguageService,
    private userService: UserService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {}

  ngOnInit() {


    this.breakpointObserver
      .observe([Breakpoints.Small])
      .subscribe(result => {
        this.isScreenSmall = result.matches;
      });

    // this.languageService.getLanguage().subscribe(language => {
    //   this.homeText = this.languageService.translate('Home');
    //   this.reportText = this.languageService.translate('Report');
    //   this.receiptText = this.languageService.translate('Receipt');
    //   this.invoiceText = this.languageService.translate('Invoice');
    //   this.VFDAccountsText = this.languageService.translate('VFD Accounts');
    //   this.profileText = this.languageService.translate('Profile');
    //   this.adminDashboardText = this.languageService.translate('Admin Dashboard');
    // });
  }

  openUserOptions(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('uuid');
    this.router.navigate(['/login']);
  }

  toggleSidebar() {
    if (this.isSmallScreen) {
      this.sidenav.toggle();
    }
  }
}
