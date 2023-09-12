import { Component, OnInit } from '@angular/core';
import { SecurityService } from 'src/app/services/security.service';
import {KeycloakService} from "keycloak-angular";
import {KeycloakProfile} from "keycloak-js";
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public authenticated = false;
  public firstName?: string | null = null;
  public lastName?: string | null = null;

  constructor(public securityService: SecurityService,public kcService:KeycloakService) {
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

  ngOnInit(): void {

  }
  public async getToken(){

  }
  public logout() {
    this.kcService.logout();
  }
  public login() {
    this.kcService.login();
  }

}
