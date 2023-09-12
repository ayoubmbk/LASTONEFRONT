import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { Tache } from '../model/taches.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SecurityService } from '../services/security.service';
import { KeycloakService } from 'keycloak-angular';
import { Situation } from '../model/Situation.model';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css']
})
export class TaskComponent implements OnInit {
  Taches!: any;
  taskForm: FormGroup;
  hoverCheckIcon = false;
  selectedStatus: Situation;
  baseUrl="http://localhost:9096/taches";

  constructor(private apiService: ApiService, private formBuilder: FormBuilder,public dialog: MatDialog,
    private http: HttpClient,
        private securityService: SecurityService,
        private keycloakservice :KeycloakService) {
    this.taskForm = this.formBuilder.group({
      nomTache: ['', Validators.required] // Assuming 'name' is the form control for the task name
    });
  }

  ngOnInit(): void {
    this.selectedStatus === 'EnCours'; // Set the initial status
    this.fetchContentBasedOnStatus(this.selectedStatus);
  }

  /*getTachesFromAPI() {
    this.apiService.getTasksUser().subscribe(
      (response: Tache[]) => {
        this.Taches = response.filter((t: any) => t.situation === 'EnCours');
        console.log(this.Taches);
      },
      (error) => {
        console.error(error);
      }
    );
  }*/
  fetchContentBasedOnStatus(status: string): void {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${this.securityService.token}`
    );

    const creatorId = this.keycloakservice.getKeycloakInstance().subject; // Retrieve the user ID

    if (!creatorId) {
      console.error('User ID is not available.');
      throw new Error('User ID is not available.');
    }

    let apiUrl = '';

    switch (status) {
      case 'EnRetard':
        apiUrl = `${this.baseUrl}/enretard/${creatorId}`;
        break;
      case 'EnCours':
        apiUrl = `${this.baseUrl}/Encours/${creatorId}`;
        break;
      case 'Terminé':
        apiUrl = `${this.baseUrl}/termine/${creatorId}`;
        break;
      default:
        apiUrl = `${this.baseUrl}/Encours/${creatorId}`;
        break;
    }

    this.http.get<any>(apiUrl, { headers }).subscribe(
      (response) => {
        console.log(response);
        this.Taches = response;
        console.log("hi from console "+response.situation)// Assign the response to the Taches variable
      },
      (error) => {
        console.error('Error fetching task content:', error);
      }
    );
  }

  updateTaskStatus(taskId: number) {
    this.apiService.updateTaskStatus(taskId).subscribe(
      () => {
        console.log("Task status updated successfully.");
        this.Taches = this.Taches.filter((t: Tache) => t.idTache !== taskId);
      },
      (error) => {
        console.error(error);
      }
    );
    window.location.reload();
  }
  addTask(): void {
    if (this.taskForm.valid) {
      const task = { nomTache: this.taskForm.value.nomTache };
      this.apiService.addTache(task).subscribe(
        (response) => {
          // Handle the success response if needed
          console.log('Task added successfully');
          this.Taches.push(response);
        },
        (error) => {
          // Handle the error if needed
          console.error('Error adding task', error);
        }
      );
      this.taskForm.reset();
    }
  }
  handleKeyPress(event: KeyboardEvent): void {
    event.preventDefault();
  }

  openTaskDialog(taskId: number): void {
    this.apiService.getTaskById(taskId).subscribe(
      (task: Tache) => {
        const dialogRef = this.dialog.open(TaskDialogComponent, {
          width: '600px',
          data: { task: task, project: null }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
          // Perform any necessary actions after the dialog is closed
        });
      },
      (error) => {
        console.error('Error fetching task details', error);
      }
    );
  }
  changeStatus(status: string): void {
    this.selectedStatus === status;
    this.fetchContentBasedOnStatus(status);
  }
}
