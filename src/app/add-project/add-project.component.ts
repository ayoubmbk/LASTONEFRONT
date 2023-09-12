import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.css']
})
export class AddProjectComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient,private apiservice:ApiService) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      numProjet: [null, Validators.required],
      nomProjet: ['', Validators.required],
      descriptionProjet: ['', [Validators.required, Validators.minLength(10)]],
      // Add other form controls as needed
    });
  }
  get f() { return this.projectForm.controls; }


  createProject() {
    if (this.projectForm.invalid) {
      return;
    }

    this.apiservice.addProject(this.projectForm.value)
      .subscribe(
        response => {
          console.log('Project created successfully');
          // Handle the response as needed
        },
        error => {
          console.error('Failed to create project', error);
          // Handle the error as needed
        }
      );
  }
  /*
  createProject() {
    this.apiservice.addProject()
      .subscribe(
        response => {
          console.log('Project created successfully');
          // Handle the response as needed
        },
        error => {
          console.error('Failed to create project', error);
          // Handle the error as needed
        }
      );
  }
*/



}
