import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthModule} from "@shared/auth/auth.module";



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AuthModule
  ],
  exports: [
    AuthModule
  ]
})
export class SharedModule { }
