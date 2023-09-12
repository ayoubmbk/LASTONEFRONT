import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Phase } from 'src/app/model/phase.model';
import { Tache } from 'src/app/model/taches.model';

@Injectable({
  providedIn: 'root'
})
export class PhaseService {
  private baseUrl = 'http://localhost:9091'; // Update the base URL

  constructor(private http: HttpClient) { }

  getPhasesByProjectId(projectId: number): Observable<Phase[]> {
    return this.http.get<Phase[]>(`${this.baseUrl}/phases/getFromProject/${projectId}`);
  }

  getTachesByPhaseId(phaseId: number) {
    return this.http.get(`${this.baseUrl}/phases/${phaseId}/get`);
  }
  getProgressPhase(phaseId: number) {
    return this.http.get(`${this.baseUrl}/phases/${phaseId}/progress`);
  }
}
