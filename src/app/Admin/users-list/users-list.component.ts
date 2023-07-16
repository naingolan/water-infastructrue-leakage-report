import { Component, NgModule, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { UserService } from 'src/app/user.service';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter'
})
export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }

    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}


@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})

export class UsersListComponent {
  users: any;

  userDataSource: MatTableDataSource<any> = new MatTableDataSource<any>([]);
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;


  displayedColumns: string[] = ['no', 'name', 'email', 'phone',  'actions'];
  constructor(private userService: UserService){}

  ngOnInit(): void {
    this.fetchAllUsers();
  }

  fetchAllUsers(): void {
    this.userService.getAllUsers().subscribe(
      (response) => {
       this.users = response.users.filter((user: { role: string; }) => user.role === 'user')
       this.userDataSource.data = this.users;
       this.userDataSource.sort = this.sort;
       this.userDataSource.paginator = this.paginator;

       console.log(this.userDataSource.data);
      },
      (error) => {
        console.log('Error fetching users:', error);
      }
    );
  }

  deleteUser(id: string): void {
    this.userService.deleteUser(id).subscribe(
      (response) => {
        console.log('User deleted successfully:', response);
        this.fetchAllUsers();
      } ,
      (error) => {
        console.log('Error deleting user:', error);
      }
    );
    }

}

