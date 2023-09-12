import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { TopBarComponent } from '../top-bar/top-bar.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule
    
  ],
  declarations: [SidenavComponent,TopBarComponent],
  exports: [
    CommonModule,
    SidenavComponent,
    RouterModule,TopBarComponent
  ]
})
export class SharedModule { }
