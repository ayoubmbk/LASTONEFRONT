import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Phase } from 'src/app/model/phase.model';
import { PhaseService } from './phase-service.service';

@Component({
  selector: 'app-phases',
  templateUrl: './phases.component.html',
  styleUrls: ['./phases.component.css']
})
export class PhasesComponent implements OnInit {
  projectId!: number;
  phases: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private phaseService: PhaseService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.projectId = +params['projetId'];
      this.fetchPhases();

    });
  }

  fetchPhases(): void {
    this.phaseService.getPhasesByProjectId(this.projectId)
    .subscribe(
      phases => {
        this.phases = phases;
        this.loadTachesForPhases();
      },
      error => console.error(error)
    );
  }
  loadTachesForPhases(): void {
    for (const phase of this.phases) {
      this.phaseService.getTachesByPhaseId(phase.id)
        .subscribe(
          taches => phase.taches = taches,
          error => console.error(error)
        );
    }
}
}
