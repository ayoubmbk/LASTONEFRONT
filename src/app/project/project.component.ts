import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {
  projects!: any;
  title ='pagination';
  POSTS:any;
  hexCodes: string[] = ['#37CAB9', '#c0b5ee', '#E0f58e','#0d141c'];
  page:number=1;
  count:number=0;
  tableSize:number=3;
  tableSizes:any=[5,10,15,20];
  constructor(private apiService: ApiService ) { }

  ngOnInit(): void {
    this.getProjectsFromAPI();

  }

  getProjectsFromAPI() {
    this.apiService.getProjects().subscribe(
      (response) => {
        this.projects = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }

  onprojectListChange(event:any):void {
    this.tableSize=event.target.value;
    this.page=1;
    this.getProjectsFromAPI()
  }
  onprojectDataChange(event:any) {
    this.page=event;
    this.getProjectsFromAPI()
  }
  gethexcodecolor():string{
    const randomIndex = Math.floor(Math.random() * this.hexCodes.length);
    return this.hexCodes[randomIndex];
  }

}
