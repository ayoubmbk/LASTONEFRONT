import { Injectable } from '@angular/core';
import { Utilisateur } from '../model/Utilisateur.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  assignedUserIds: string[] = [];

  constructor() { }

  assignUser(userId: string) {
    this.assignedUserIds.push(userId);
  }

  isUserAssigned(userId: string): boolean {
    return this.assignedUserIds.includes(userId);
  }

  getFilteredUsers(allUsers: Utilisateur[]): Utilisateur[] {
    return allUsers.filter(user => !this.isUserAssigned(user.id));
  }
}
