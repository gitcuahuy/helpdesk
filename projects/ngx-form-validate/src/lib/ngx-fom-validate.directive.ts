import {Directive, ElementRef, Host, Inject, Input, OnDestroy, OnInit, Optional, Renderer2} from '@angular/core';
import {AbstractControl, FormArrayName, FormControlName, FormGroupName, NgModel} from '@angular/forms';
import {Subscription} from 'rxjs';
import {ERROR_MESSAGE_TOKEN, ErrorMessageMap, ErrorMessageMapResult} from './error-message-map-token';
import {
  DefaultRenderDivNodeStrategy,
  RENDER_DIV_NODE_STRATEGY,
  RenderDivNodeStrategy
} from './render-div-node-strategy';
import {TranslateService} from "@ngx-translate/core";

@Directive({
  selector: '[NgModel][appAutoValidate],[formArrayName][appAutoValidate],[formControlName][appAutoValidate],[appAutoValidate]'
})
export class NgxFomValidateDirective implements OnInit, OnDestroy {
  static defaultRenderDivNodeStrategy: RenderDivNodeStrategy = new DefaultRenderDivNodeStrategy();
  // Có tể thay đổi tên input từ thẻ bên ngoài
  @Input('auto-control') control: AbstractControl | null = null;
  divNode: any; // message tag
  isRender = false;
  @Input() separator = ', ';
  // for thẻ input nào thì hiển thị message lỗi ở cha của thẻ đó
  @Input('auto-for') for: any;
  @Input() customiseErrorMessage?: ErrorMessageMap;
  @Input() fieldName = '';
  private valueChangeSubscription?: Subscription | any;
  private statusChangeSubscription?: Subscription | any;

  constructor(
    @Inject(ERROR_MESSAGE_TOKEN) private errorMessageMap: ErrorMessageMap,
    @Optional() @Inject(RENDER_DIV_NODE_STRATEGY) private renderDivNodeStrategy: RenderDivNodeStrategy,
    @Optional() @Host() private formControlName: FormControlName,
    @Optional() @Host() private formGroupName: FormGroupName,
    @Optional() @Host() private formArrayName: FormArrayName,
    @Optional() @Host() private ngModel: NgModel,
    @Optional() private translateService: TranslateService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {
    if (this.customiseErrorMessage) {
      this.errorMessageMap = {
        ...this.errorMessageMap,
        ...this.customiseErrorMessage
      };
    }
  }

  ngOnInit(): void {

    if (!this.control) {
      if (this.formControlName) {
        this.control = this.formControlName.control;
      } else if (this.formGroupName) {
        this.control = this.formGroupName.control;
      } else if (this.formArrayName) {
        this.control = this.formArrayName.control;
      } else if (this.ngModel) {
        this.control = this.ngModel.control;
      }
    }
    if (!this.control) {
      throw new Error('Neel Form Control');
    }
    const self = this;
    const originalMethod = this.control.markAsTouched;
    this.control.markAsTouched = () => {
      originalMethod.call(this);
      self.checkError();
    };
    if (!this.renderDivNodeStrategy) {
      this.renderDivNodeStrategy = NgxFomValidateDirective.defaultRenderDivNodeStrategy;
    }
    // bind event
    if (this.for) {
      this.for = new ElementRef(this.for);
    } else {
      this.for = this.elementRef;
    }
    if (!this.fieldName) {
      const labels: HTMLElement[] = this.for.nativeElement.parentNode.getElementsByTagName('label');
      if (!labels.length) {
        console.error('Không tìm thấy label hoặc fieldName bạn cần truyền vào input để hiển thị');
        return;
      }
      const fieldName = labels[0].innerText || '';
      this.fieldName = fieldName.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
    }

    this.renderer.listen(this.for.nativeElement, 'focus', this.onFocus);
    // this.renderer.listen(this.for.nativeElement, 'click', this.checkError);
    this.renderer.listen(this.for.nativeElement, 'blur', this.onBlur);
    this.statusChangeSubscription = this.control.statusChanges.subscribe(() => this.checkError());

    this.divNode = this.renderer.createElement('small');
    this.renderer.setAttribute(this.divNode, 'id', 'validate-error');
    this.renderer.addClass(this.divNode, 'validate-error');
    this.renderDivNodeStrategy.renderDiv(this.renderer, this.elementRef, this.divNode);
  }

  ngOnDestroy(): void {
    if (this.statusChangeSubscription) {
      this.statusChangeSubscription.unsubscribe();
    }
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  checkError(): void {
    if (this.control) {
      // this.control.markAsTouched();
      if (this.control?.invalid && this.control.errors !== null) {
        const errorMessage = Object.keys(this.control.errors).map((key: string, index: number, array: string[]) => {
          if (!this.errorMessageMap[key]) {
            throw Error(`${key} isn't defined in error message map`);
          } else {
            if (typeof this.errorMessageMap[key] === 'function' && (this.control?.errors && this.control?.errors[key] !== null)) {
              const controlErr: (error: any) => ErrorMessageMapResult = this.errorMessageMap[key] as (error: any) => ErrorMessageMapResult;
              const {message, params} = controlErr(this.control.errors[key]);
              return this.translateService.instant(message, {
                param: params?.required ?? '',
                fieldName: this.fieldName
              });
            } else if (typeof this.errorMessageMap[key] === 'string') {
              return this.translateService.instant(this.errorMessageMap[key] as string, {fieldName: this.fieldName});
            }
          }
        }).join(this.separator);
        if (!errorMessage) {
          this.renderer.removeChild(this.elementRef.nativeElement.parentNode, this.divNode);
          this.isRender = false;
          return;
        }
        this.renderer.setProperty(this.divNode, 'innerHTML', errorMessage);
        if (!this.isRender) {
          this.renderDivNodeStrategy.insertDiv(this.renderer, this.elementRef, this.divNode);
          this.isRender = true;
        }
      } else {
        if (this.isRender) {
          this.renderer.removeChild(this.elementRef.nativeElement.parentNode, this.divNode);
          this.isRender = false;
        }
      }
    }
  }


  onFocus = ($event: any) => {
    console.log('focus');
    this.checkError();
    this.valueChangeSubscription = this.control?.valueChanges.subscribe(() => this.checkError());
    // this.statusChangeSubscription = this.control.statusChanges.subscribe(() => this.checkError());
  };

  onBlur = ($event: any) => {
    console.log('blur');
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
    // if(this.statusChangeSubscription) this.statusChangeSubscription.unsubscribe();
    this.checkError();
  };
}
