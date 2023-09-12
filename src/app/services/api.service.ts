   import { Injectable } from "@angular/core";
    import { HttpClient, HttpHeaders } from "@angular/common/http";
    import { Observable, throwError } from "rxjs";
    import { SecurityService } from "./security.service";
    import {KeycloakEventType, KeycloakService} from "keycloak-angular";
import { Utilisateur } from "../model/Utilisateur.model";
import { Tache } from "../model/taches.model";


    @Injectable({ providedIn: 'root' })
    export class ApiService {
      private baseUrl = 'http://localhost:9095';
      private baseUrl1 = 'http://localhost:9096';

      private apiUrl = 'http://localhost:9095/projects';
      private apiUrl1 = 'http://localhost:9096/taches';
      private apiUrlPhase = 'http://localhost:9097/phases';


      

      constructor(
        private http: HttpClient,
        private securityService: SecurityService,
        private keycloakservice :KeycloakService
      ) {}

      getProjects(): Observable<any> {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.securityService.token}`
        );


        const creatorId = this.keycloakservice.getKeycloakInstance().subject; // Retrieve the user ID
        console.log(creatorId + "abcdefg")

        if (!creatorId) {
          console.error('User ID is not available.'); // Log an error if the user ID is null
          return throwError('User ID is not available.');
        }

        return this.http.get<any>(`${this.baseUrl}/projects/creator/${creatorId}`, {
          headers,
        });
      }


      /*this the add project api*/
      addProject(project?: any): Observable<any>  {
        const createdBy = this.keycloakservice.getKeycloakInstance().subject;
        const url = `${this.baseUrl}/projects/add/${createdBy}`;
        const headers = new HttpHeaders()
          .set('Authorization', 'Bearer ${this.securityService.token}'); // Replace with your access token from Keycloak
          return this.http.post(url, project, { headers });
      }

      /*this is getproject by id */



      /*get project by id */
      getProjectDetails(projetId?: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/projects/${projetId}`);
      }
      getTaskCount(projeId: number): Observable<number> {
        const url = `${this.apiUrl1}/${projeId}/taskcount`;
        return this.http.get<number>(url);
      }
      getTaskCountEncours(projeId: number): Observable<number> {
        const url = `${this.apiUrl1}/countEnCours/${projeId}`;
        return this.http.get<number>(url);
      }
      getPhasesTotal(projeId: number): Observable<number> {
        const url = `${this.apiUrlPhase}/count/${projeId}`;
        return this.http.get<number>(url);
      }
      getAllUsers(): Observable<Utilisateur[]> {
        const url = `${this.baseUrl}/users/allusers`;
        return this.http.get<Utilisateur[]>(url);
      }
      getAllEquipes(): Observable<Utilisateur[]> {
        const url = `${this.baseUrl}/equipes/getAllEquipes`;
        return this.http.get<Utilisateur[]>(url);
      }
      getTasksUser(): Observable<any> {
        const headers = new HttpHeaders().set(
          'Authorization',
          `Bearer ${this.securityService.token}`
        );


        const creatorId = this.keycloakservice.getKeycloakInstance().subject; // Retrieve the user ID

        if (!creatorId) {
          console.error('User ID is not available.'); // Log an error if the user ID is null
          return throwError('User ID is not available.');
        }

        return this.http.get<any>(`${this.baseUrl}/taches/creator/${creatorId}`, {
          headers,
        });
      }
      updateTaskStatus(taskId: number): Observable<string> {
        const url = `${this.baseUrl}/taches/${taskId}/status`;
        return this.http.put<string>(url, null);
      }
      assignUserToProject(projectId: number, userId: string) {
        const url = `${this.baseUrl}/projects/${projectId}/assign-user/${userId}`;
        return this.http.post(url, {});
      }

      /*add a task */
      addTache(tache?: any): Observable<any>  {
        const createdBy = this.keycloakservice.getKeycloakInstance().subject;
        const url = `${this.baseUrl1}/taches/addTacheToCreator/${createdBy}`;
        const headers = new HttpHeaders()
          .set('Authorization', 'Bearer ${this.securityService.token}'); // Replace with your access token from Keycloak
          return this.http.post(url, tache, { headers });
      }

      getTaskById(taskId: number): Observable<Tache> {
        const apiUrl = `${this.baseUrl1}/taches/${taskId}`;
        return this.http.get<Tache>(apiUrl);
      }


    }
