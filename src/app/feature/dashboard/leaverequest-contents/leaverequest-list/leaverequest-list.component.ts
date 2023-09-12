import { EmployeeService } from './../../services/employee.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError, finalize } from 'rxjs/operators';
import { Observable, Subject, concat, of, forkJoin } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { EmployeeLeaveService } from '../../services/employeeLeave.service';
import { Utilisateur } from 'src/app/model/Utilisateur.model';

@Component({
  selector: 'app-leaverequest-list',
  templateUrl: './leaverequest-list.component.html',
  styleUrls: ['./leaverequest-list.component.css']
})
export class LeaverequestListComponent implements OnInit {

  leaveRequests;
  errorMsg;

  loading = true;
  currentPage = 1;
  totalElements;
  numberOfElements;
  size = 10;
  sortKey = 'fromDate';
  reverse = false;

  allEmployees: Observable<any>;
  employeeinput$ = new Subject<string>();
  isSelectLoading = false;

  constructor(private _employeeLeaveService: EmployeeLeaveService, private _employeeService: EmployeeService) { }

  ngOnInit() {
    this.getAllEmployeeLeaves();
    this.loadEmployee();
  }

  getPage(page: number) {
    this.loading = true;
    this.currentPage = page;
    this.getAllEmployeeLeaves();
  }

  sort(key: string) {
    this.loading = true;
    this.sortKey = key + ','.concat(this.reverse ? 'DESC' : 'ASC');
    this.reverse = !this.reverse;
    this.getAllEmployeeLeaves();
  }

  getAllEmployeeLeaves() {
    this._employeeLeaveService.getAllEmployeeLeaves(this.currentPage - 1, this.size, this.sortKey)
      .subscribe(
        data => {
          this.leaveRequests = data.content;
          this.totalElements = data.totalElements;
          this.size = data.size;
          this.numberOfElements = data.numberOfElements;
          // Fetch user data for all leaveRequests after loading the leaveRequests
          this.fetchUserDataForLeaveRequests();
        },
        error => this.errorMsg = error,
        () => { // This callback is called when the observable completes
          this.loading = false;
        }
      );
  }

  private loadEmployee() {
    this.allEmployees = concat(
      of([]), // default items
      this.employeeinput$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        tap(() => this.isSelectLoading = true),
        switchMap(term => this._employeeService.getEmployeeByFullName(term).pipe(
          catchError(() => of([])), // empty list on error
          tap(() => this.isSelectLoading = false)
        ))
      )
    );
  }

  private fetchUserDataForLeaveRequests() {
    const requests = [];
    for (const leaverequest of this.leaveRequests) {
      if (leaverequest.employeeId) {
        const request = this.getUserData(leaverequest.employeeId)
          .pipe(
            catchError(() => of(null)) // Handle errors gracefully
          );
        requests.push(request);
      }
    }

    forkJoin(requests).subscribe(
      (users: Utilisateur[]) => {
        // Update the leave requests with the usernames
        users.forEach((user, index) => {
          if (user) {
            this.leaveRequests[index].username = user.username;
          }
        });
      },
      error => {
        console.error('Error fetching user data:', error);
      }
    );
  }

  private getUserData(userId: string): Observable<Utilisateur> {
    return this._employeeService.getUserById(userId);
  }
}
