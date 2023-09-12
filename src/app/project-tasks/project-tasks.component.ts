import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-project-tasks',
  templateUrl: './project-tasks.component.html',
  styleUrls: ['./project-tasks.component.css']
})
export class ProjectTasksComponent implements OnInit {
  projectId!: number;
  tasks!: any;
  displayedColumns: string[] = ['nomTache', 'status', 'Difficulty', 'Phase'];
  dataSource !:any;

  constructor(
    private route: ActivatedRoute,
    private taskService: TaskService,

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.projectId = Number(params.get('projetId'));
      this.loadTasks();

    });
  }

 loadTasks() {
    this.taskService.getTasksByProject(this.projectId).subscribe(
      (response) => {
        this.tasks = response;

        this.dataSource=this.tasks;
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
