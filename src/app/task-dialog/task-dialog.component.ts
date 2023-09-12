import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tache } from '../model/taches.model';
import { Project } from '../model/project.model';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ApiService } from '../services/api.service';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { Phase } from '../model/phase.model';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.css']
})
export class TaskDialogComponent  {
  task: Tache;
  project: Project;
  projectControl = new FormControl();
  filteredProjects: Observable<Project[]>;
  projects: Project[] = [];
  selectedProject: Project | null = null;
  phases: Phase[] = [];
  selectedPhase: Phase | null = null;

  constructor(
    private apiService: ApiService,
    private httpClient: HttpClient,
    public dialogRef: MatDialogRef<TaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA)   public data: any
  ) {
    this.task = data.task;
    this.project = data.project;

   }

  ngOnInit(): void {

    // Call the API to get the projects for the user
    this.filteredProjects = this.projectControl.valueChanges.pipe(
      startWith(''), // Added empty string as initial value
      map(value => this._filterProjects(value))
    );

    // Call the API to get the projects for the user
    this.apiService.getProjects().subscribe(
      (response: Project[]) => {
        this.projects = response;
        console.log('Projects:', response); // Log the response
      },
      (error) => {
        console.error(error);
      }
    );

}
private _filterProjects(value: string): Project[] {
  if (!value) {
    return this.projects;
  }
  return this.projects.filter(project => project.nomProjet === value);
}



onProjectSelected(event: MatSelectChange): void {
  this.selectedProject = event.value as Project;
  console.log('Selected Project ID:', this.selectedProject.projetId);
  const projectId = this.selectedProject.projetId;

  this.getPhasesByProjectId(projectId);
  // Perform any necessary actions with the selected project
}


getPhasesByProjectId(projectId: number): void {
  console.log("projectiiiiiiid"+ projectId)
  const url = `http://localhost:9097/phases/getFromProject/${projectId}`;
  this.httpClient.get(url).subscribe(
    (response: Phase[]) => {
      // Handle the response and extract the list of phases
      console.log("API Response:", response); // Log the response to inspect its structure
 // Check if the response has a property named 'phases'

  this.phases = response;
  console.log("Phases:", this.phases); // Log the phases

  // Perform any necessary actions with the phases

},
    (error) => {
      console.error(error);
    }
  );
}


assignTaskToProjectAndPhase(tacheId: number, projetId: number, phaseId?: number): void {
  const url = `http://localhost:9096/taches/assignToProjetPhase/${tacheId}/${projetId}/${phaseId || ''}`;
  this.httpClient.post(url, {}).subscribe(
    (response) => {
      // Handle the response if needed
      console.log('Task assigned successfully');
    },
    (error) => {
      console.error('Error assigning task:', error);
    }
  );
}


  }





