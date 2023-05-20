import {NgModule} from '@angular/core';
import {NgxFormValidateComponent} from './ngx-form-validate.component';
import {NgxFomValidateDirective} from './ngx-fom-validate.directive';
import {ERROR_MESSAGE_TOKEN} from "./error-message-map-token";
import {DefaultErrorMessageMap} from "./locale/default-error-message-map";
import {DefaultRenderDivNodeStrategy, RENDER_DIV_NODE_STRATEGY} from "./render-div-node-strategy";


@NgModule({
  declarations: [
    NgxFormValidateComponent,
    NgxFomValidateDirective
  ],
  imports: [
  ],
  exports: [
    NgxFormValidateComponent,
    NgxFomValidateDirective
  ],
  providers: [
    {
      provide: ERROR_MESSAGE_TOKEN,
      useValue: DefaultErrorMessageMap,
    },
    {
      provide: RENDER_DIV_NODE_STRATEGY,
      useClass: DefaultRenderDivNodeStrategy,
    }
  ]
})
export class NgxFormValidateModule { }
