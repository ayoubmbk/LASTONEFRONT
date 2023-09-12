import { HttpClientModule } from '@angular/common/http';
import { AuthService } from './dashboard/auth/auth.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../shared/material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    HttpClientModule,
    MaterialModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    
  ],
  providers: [AuthService]
})
export class FeatureModule { }
