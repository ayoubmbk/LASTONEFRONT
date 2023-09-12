import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private projectId!: string;

  setProjectId(id: string) {
    this.projectId = id;
  }

  getProjectId() {
    return this.projectId;
  }
}
