import { Directive, ElementRef, HostListener, Inject, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { AbstractDebounceDirective } from './abstract-debounce.directive';
import { Subscription } from 'rxjs';
import {LoadingService} from "@shared/service/loading.service";

@Directive({
  selector: '[debounceClick]'
})
export class DebounceClickDirective extends AbstractDebounceDirective implements OnDestroy, OnInit {
  @Input() isServerLoading = true;
  private _sourceRenderer: Renderer2;
  private _sourceElementRef: ElementRef;
  private subscriptionList: Subscription[] = [];
  private loading = false;
  constructor(@Inject(Renderer2) renderer: Renderer2,
              @Inject(ElementRef) elementRef: ElementRef,
              private loadingService: LoadingService) {
    super();
    this._sourceRenderer = renderer;
    this._sourceElementRef = elementRef;
  }

  private removeDisabled ?: NodeJS.Timeout;

  ngOnInit(): void {
    super.ngOnInit();
    if (this.isServerLoading) {
      const subscriptionChangeEvent = this.loadingService.isLoading.subscribe((loading) => {
        this.loading = loading;
        // if (loading) {
        //   this._sourceRenderer.setAttribute(this._sourceElementRef.nativeElement, 'disabled', 'true');
        // } else {
        //   this._sourceRenderer.removeAttribute(this._sourceElementRef.nativeElement, 'disabled');
        // }
      });
      this.subscriptionList.push(subscriptionChangeEvent);
    }
  }

  @HostListener('click', ['$event'])
  clickEvent(event: any): void {
    event.preventDefault();
    if (this.loading) {
      return;
    }
    this.onKeyUp(event);
    if (!this.isServerLoading) {
      event.srcElement.setAttribute('disabled', true);
      if (this.removeDisabled) {
        clearTimeout(this.removeDisabled);
      }
      this.removeDisabled = setTimeout(() => {
        event.srcElement.removeAttribute('disabled');
      }, this.debounceTime);
    }
  }

  public onKeyUp(event: any): void {
    this.emitEvent$.next(event);
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.subscriptionList.forEach((subscription) => subscription.unsubscribe());
  }
}
