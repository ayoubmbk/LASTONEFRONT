import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tache } from './model/tache.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:9096/taches'; // Replace with your API URL

  constructor(private http: HttpClient) {}

  createTacheAndAssignToPhase(phaseId: number, tache: Tache): Observable<Tache> {
    const url = `${this.apiUrl}/add/${phaseId}`;
    return this.http.post<Tache>(url, tache);
  }

  getTacheById(id: number): Observable<Tache> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Tache>(url);
  }

  getAllTaches(): Observable<Tache[]> {
    const url = `${this.apiUrl}/all`;
    return this.http.get<Tache[]>(url);
  }

  updateTache(id: number, tache: Tache): Observable<Tache> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Tache>(url, tache);
  }

  deleteTache(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  assignTacheToUser(tacheId: number, userId: string): Observable<string> {
    const url = `${this.apiUrl}/${tacheId}/users/${userId}`;
    return this.http.post<string>(url, {});
  }

  removeTaskFromPhase(phaseId: number, taskId: number): Observable<void> {
    const url = `${this.apiUrl}/${phaseId}/tasks/${taskId}`;
    return this.http.delete<void>(url);
  }

  assignTaskToPhase(phaseId: number, taskId: number): Observable<void> {
    const url = `${this.apiUrl}/${phaseId}/tasks/${taskId}`;
    return this.http.post<void>(url, {});
  }

  getTasksByProject(projectId: number): Observable<Tache[]> {
    const url = `${this.apiUrl}/${projectId}/tasks`;
    return this.http.get<Tache[]>(url);
  }
  getNumberOfTasksForProject(projectId: number): Observable<number> {
    const url = `${this.apiUrl}/count?projectId=${projectId}`;
    return this.http.get<number>(url);
  }

}
