import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import {RouterModule} from "@angular/router";
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';



@NgModule({
  declarations: [
    LayoutComponent,
    MainLayoutComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class LayoutModule { }
