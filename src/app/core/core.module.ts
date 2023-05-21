import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IconsModule} from "./icons/icons.module";
import {LayoutComponent} from "./layout/layout.component";
import {LayoutModule} from "./layout/layout.module";


@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    IconsModule,
    LayoutModule
  ],
  exports: [
    IconsModule,
    LayoutModule
  ]
})
export class CoreModule { }
