import { Directive, HostListener } from '@angular/core';
import { AbstractDebounceDirective } from './abstract-debounce.directive';
import CommonUtils from "@shared/utils/comon.utils";

@Directive({
  selector: '[debounceKeyUp]'
})
export class DebounceKeyupDirective extends AbstractDebounceDirective {

  constructor() {
    super();
  }

  @HostListener('keyup', ['$event'])
  public onKeyUp(event: any): void {
    event.preventDefault();

    const keycode = event.keyCode;
    if (CommonUtils.isKeyCodePrintable(keycode)) {
      this.emitEvent$.next(event);
    }
  }

}
