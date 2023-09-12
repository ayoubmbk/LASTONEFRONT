import { Component, OnInit } from '@angular/core';
import { SecurityService } from '../services/security.service';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  userProfile!: any;
  selectedOption: string = 'Semaine';
  public firstName?: string | null = null;
  public lastName?: string | null = null;
  currentDate!: any;
  completedTasksCount: number = 0;
  projectId: any;
  public notification: string;
    private notificationSubscription: Subscription;
    notifications: string[] = [];


  constructor(
    public securityService: SecurityService,
    private router: Router,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    private http: HttpClient,
    private keycloakservice: KeycloakService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.currentDate = this.datePipe.transform(today, 'EEEE d MMMM', 'fr');
    this.keycloakservice.loadUserProfile().then((profile: KeycloakProfile) => {
      this.firstName = profile.firstName;
      this.lastName = profile.lastName;
      this.fetchCompletedTasksCount();
    });

    this.fetchCompletedTasksCount();
 

  }


  

  fetchCompletedTasksCount() {
    const creatorId = this.keycloakservice.getKeycloakInstance().subject;
    this.http
      .get<any>(`http://localhost:9096/taches/nb-taches-termine/${creatorId}`)
      .subscribe((response) => {
        this.completedTasksCount = response;
      });
  }

  onTasksUpdated(): void {
    this.fetchCompletedTasksCount();
  }
}
