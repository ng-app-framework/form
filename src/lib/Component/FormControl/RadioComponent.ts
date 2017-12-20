import {
    ViewEncapsulation, Component, Input, ViewChild, OnInit, OnDestroy,
    Inject, Injector, Output, EventEmitter
} from '@angular/core';
import {
    FormControl,
    NG_VALUE_ACCESSOR
} from "@angular/forms";
import {OnChange} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";
import {NgFormControl} from "../NgFormControl";


@Component({
    selector     : 'radio',
    template     : `
        <div class="form-group validate">
            <label *ngIf="labelPlacement === 'above'">
                {{ label }}
            </label>
            <div></div>
            <div (click)="check();" class="input-group check-container" tabindex="0" #element
                 [class.label-above]="labelPlacement === 'above'">
                <span class="form-control ng-control" *ngIf="labelPlacement === 'before'"
                      [ngClass]="getNgClassesForElement('label', 'before')">
                    <label>
                        {{ label }}
                    </label>
                </span>
                <div class="input-group-addon ng-control" [ngClass]="getNgClassesForElement('addon')">
                    <input readonly type="radio"
                           [id]="identifier"
                           [disabled]="disabled"
                           [checked]="value === checkedValue"
                           tabindex="-1"/>
                </div>
                <span class="form-control ng-control" *ngIf="labelPlacement === 'after'"
                      [ngClass]="getNgClassesForElement('label', 'after')">
                    <label>
                        {{ label }}
                    </label>
                </span>
            </div>
        </div>
    `,
    styleUrls    : ['./assets/check-box.scss'],
    providers    : [
        {
            provide    : NG_VALUE_ACCESSOR,
            useExisting: RadioComponent,
            multi      : true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class RadioComponent extends NgFormControl<any> implements OnInit, OnDestroy {

    @Input() name: string               = '';
    @Input() label: string              = '';
    @Input() parentFormControl: FormControl;
    @Input() labelPlacement: string     = 'after';
    @Input() checkedValue: any          = true;
    @Input() disabled: boolean          = false;
             required: boolean          = false;
    @OnChange @Input() invalid: boolean = false;

    identifier = `radio-${identifier++}`;

    @Output() onTouch = new EventEmitter<any>();

    @ViewChild("element") element;

    shouldValidate = false;

    constructor(@Inject(Injector) public injector: Injector) {
        super(injector, [], []);
    }

    ngOnInit() {
        super.ngOnInit();
        Observable.fromEvent(this.element.nativeElement, 'keydown')
            .takeUntil(this.onDestroy$)
            .subscribe((event: KeyboardEvent) => {
                if (event.key === ' ') {
                    this.check();
                }
            });
    }

    check() {
        if (!this.disabled) {
            this.value = this.checkedValue;
            this.model.control.markAsTouched();
            this.onTouch.emit();
        }
    }

    getNgClassesForElement(element, position = null) {
        if (element === 'addon') {
            if (this.labelPlacement === 'above') {
                return {
                    'ng-invalid': (this.invalid) && this.control.touched,
                    'ng-touched': this.control.touched,
                    'ng-valid'  : !(this.invalid) && this.control.touched
                };
            }
            return {};
        }
        if (this.labelPlacement === position) {
            return {
                'ng-invalid': (this.invalid) && this.control.touched,
                'ng-touched': this.control.touched,
                'ng-valid'  : !(this.invalid) && this.control.touched
            };
        }
        return {};
    }

}

let identifier = 0;
