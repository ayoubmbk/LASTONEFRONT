import { KeycloakService } from 'keycloak-angular';
import { EmployeeService } from './../services/employee.service';
import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-dash-home',
  templateUrl: './dash-home.component.html',
  styleUrls: ['./dash-home.component.css']
})
export class DashHomeComponent implements OnInit {
  public authenticated = false;
  public firstName?: string | null = null;
  public lastName?: string | null = null;


  constructor(private _employeeService: EmployeeService,private kcService: KeycloakService,public securityService: SecurityService) { 
    this.kcService.isLoggedIn().then((authenticated) => {
      this.authenticated = authenticated;
      if (authenticated) {
        this.kcService.loadUserProfile().then((profile: KeycloakProfile) => {
          this.firstName = profile.firstName;
          this.lastName = profile.lastName;
        });
      }
    });
  }
  


  ngOnInit() {
   // this.getUserInfo();
   this.kcService.isLoggedIn().then((authenticated) => {
    if (authenticated) {
      console.log('User is authenticated sssssssssssss');
      const userInfo = this.kcService.getKeycloakInstance().idTokenParsed;
      console.log('User Info:', userInfo);
    } else {
      console.log('User is not authenticated');
    }
  }).catch((error) => {
    console.error('Keycloak initialization error:', error);
  });
  }

  getUserInfo() {
    this._employeeService.getCurrentEmployee()
      .subscribe(
        res => {
          const role = res.role;
          console.log(res);
          localStorage.setItem('role', role);
        },
        error => {
          // this.login_user_msg = "Oops ! Can't load Profile";
        });
  }
   public logout() {
    this.kcService.logout();
  }
  public login() {
    this.kcService.login();
  }


}
