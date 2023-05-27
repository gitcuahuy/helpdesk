import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthModule} from "@shared/auth/auth.module";
import {HasRolesDirective} from "@shared/directive/has-roles.directive";
import {AppTrimDirective} from "@shared/directive/app.trim.directive";
import {DebounceKeyupDirective} from "@shared/directive/debounce-keyup.directive";
import {DebounceClickDirective} from "@shared/directive/debounce-click.directive";



@NgModule({
  declarations: [
    HasRolesDirective,
    AppTrimDirective,
    DebounceKeyupDirective,
    DebounceClickDirective
  ],
  imports: [
    CommonModule,
    AuthModule,

  ],
  exports: [
    AuthModule,
    HasRolesDirective,
    AppTrimDirective,
    DebounceKeyupDirective,
    DebounceClickDirective
  ]
})
export class SharedModule { }
