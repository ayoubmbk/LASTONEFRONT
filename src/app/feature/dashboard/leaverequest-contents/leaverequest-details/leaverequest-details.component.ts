import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmployeeLeaveService } from './../../services/employeeLeave.service';
import { Component, OnInit } from '@angular/core';
import { EmployeeLeave } from '../../model/employeeLeave';
import { EmployeeService } from '../../services/employee.service'; // Import the EmployeeService
import { Utilisateur } from 'src/app/model/Utilisateur.model';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakInstance } from 'keycloak-js';

@Component({
  selector: 'app-leaverequest-details',
  templateUrl: './leaverequest-details.component.html',
  styleUrls: ['./leaverequest-details.component.css']
})
export class LeaverequestDetailsComponent implements OnInit {

  private id: number;
  private sub: any;
  errorMsg: string;
  isRequestEdit = false;
  user:Utilisateur;

  isLeaveRequestSelected = false;
  selectedLeaveRequest: EmployeeLeave;
  selected_leave_msg: string;
  requestApproveForm: FormGroup;
  has_error = false;
  approve_leave_update_msg: string;
  submitted = false;
  public userId?: string | null = null;
  public role?: string | null = null;

  


  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private _employeeLeaveService: EmployeeLeaveService,
    private _employeeService: EmployeeService,
    private kcService: KeycloakService // Import the EmployeeService
  ) { }

  ngOnInit() {
    this.routeId();
  }

  routeId() {
    this.sub = this.route.params.subscribe(params => {
      this.id = +params['id']; // (+) converts string 'id' to a number
      this.getEmployeeLeaveById(this.id);
    });
  }

  initRequestApproveForm() {
    this.requestApproveForm = this.formBuilder.group({
      leaveId: [this.selectedLeaveRequest.leaveId],
      deniedReason: [this.selectedLeaveRequest.deniedReason],
      status: [this.selectedLeaveRequest.status, Validators.required]
    });
  }

  toggleEdit() {
    this.isRequestEdit = !this.isRequestEdit;
    this.initRequestApproveForm();
  }

  get f() { return this.requestApproveForm.controls; }

  onSubmit() {
    this.kcService.isLoggedIn().then((authenticated) => {
      if (authenticated) {
        this.kcService.loadUserProfile().then((userProfile) => {
          const keycloakInstance = this.kcService.getKeycloakInstance();
          const userId = keycloakInstance.subject // This is the user's ID
          const roles = keycloakInstance.realmAccess.roles; // This is an array of user's roles
  
          // Use roles as needed
          console.log('User ID sssssssss:', userId);
          console.log('User Roles:', roles);
  
          // Now you can use userId and roles in your HTTP request
          const requestData = {
            leaveDTO: this.requestApproveForm.value,
            employeeId: userId,
            roles: roles // You can pass the roles array directly
          };
  
          this._employeeLeaveService.approveEmployeeLeave(requestData).subscribe(
            (res) => {
              this.has_error = false;
              this.approve_leave_update_msg = 'Successfully Submitted';
              this.selectedLeaveRequest = res;
              this.requestApproveForm.reset();
              this.submitted = false;
            },
            (error) => {
              this.has_error = true;
              this.approve_leave_update_msg = error.error.message;
            }
          );
        });
      } else {
        console.log('User is not authenticated');
      }
    }).catch((error) => {
      console.error('Keycloak initialization error:', error);
    });
  }
  

  getEmployeeLeaveById(id: number) {
    if (id > 0) {
      this._employeeLeaveService.getEmployeeLeaveById(id)
        .subscribe(
          data => {
            this.selectedLeaveRequest = data;
            this.isLeaveRequestSelected = true;
            // Fetch user data and update the employeeId to username
           this.getUserData(this.selectedLeaveRequest.employeeId);



          },
          error => {
            this.errorMsg = error;
            this.selected_leave_msg = 'Oops! Can\'t load selected Leave Request';
          });
    } else {
      this.isLeaveRequestSelected = false;
    }
  }

  // Function to fetch user data and update the employeeId to username
  private getUserData(employeeId: String) {
    this._employeeService.getUserById(employeeId)
      .subscribe(
        (user: any) => {
          // Update the employeeId to username
          this.selectedLeaveRequest.employeeId = user.username;
        },
        error => {
          console.error('Error fetching user data:', error);
        }
      );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}