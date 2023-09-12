import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule, KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { NavbarComponent } from './includes/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectComponent } from './project/project.component';
import { TaskComponent } from './task/task.component';
import { AddProjectComponent } from './add-project/add-project.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProjectIdComponent } from './project-id/project-id.component';
import { PhasesComponent } from './phases/phases/phases.component';
import { ProjectTasksComponent } from './project-tasks/project-tasks.component';
import {MatTableModule} from '@angular/material/table';
import {MatDialogModule} from '@angular/material/dialog';
import { NgxPaginationModule } from 'ngx-pagination';
import { DatePipe } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import { SearchPipe } from './project-id/search.pipe';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { WebSocketService } from './web-socket.service';
import { RouterModule } from '@angular/router';
import { FeatureModule } from './feature/feature.module';
import { SharedModule } from './shared/shared.module';
import { DashboardModule } from './feature/dashboard/dashboard.module';

export function kcFactory(kcfactory: KeycloakService) {
  return () => kcfactory.init({
    config: {
      url: 'http://localhost:8080/auth/',
      realm: 'ppl',
      clientId: 'ppl',
    },
    initOptions: {
      onLoad: 'login-required',
    },
  }).then((authenticated) => {
    if (authenticated) {
      // If the user is authenticated, you can access user information
      const userProfile = kcfactory.getKeycloakInstance().idTokenParsed;
      localStorage.setItem('user', JSON.stringify(userProfile));
    }
  });
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProjectComponent,
    TaskComponent,
    AddProjectComponent,
    ProjectIdComponent,
    PhasesComponent,
    ProjectTasksComponent,
    SearchPipe,
    TaskDialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    BrowserAnimationsModule,
    MatIconModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatDialogModule,
    NgxPaginationModule,
    MatOptionModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSelectModule,
    MatButtonToggleModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule,
    CoreModule,
    FeatureModule,
    SharedModule,
    DashboardModule



  ],
  providers: [
    {provide : APP_INITIALIZER, deps : [KeycloakService],useFactory : kcFactory, multi : true},
    DatePipe,WebSocketService
  ],

  bootstrap: [AppComponent]
})
export class AppModule { }
