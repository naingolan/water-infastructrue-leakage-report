import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(): boolean {
    const userRole = this.userService.getUserRole();
    if (userRole === 'admin') {
      return true;
    } else {
      this.router.navigate(['/access-denied']);
      return false;
    }
  }
}
