import { AuthService } from './../../../feature/dashboard/auth/auth.service';
import { Component } from '@angular/core';
import { SidebarService } from '../service/sidebar.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent {

  isLoggedIn= this.kcService.isLoggedIn();

  constructor(private _sideBarService: SidebarService,public kcService:KeycloakService) { }

  toggleSidebar() {
    this._sideBarService.toggle();
  }

}
