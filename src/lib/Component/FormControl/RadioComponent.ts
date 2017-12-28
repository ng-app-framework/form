import {
    ViewEncapsulation, Component, Input, ViewChild, OnInit, OnDestroy,
    Inject, Injector, Output, EventEmitter
} from '@angular/core';
import {
    FormControl, FormGroup,
    NG_VALUE_ACCESSOR
} from "@angular/forms";
import {OnChange} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";
import {NgFormControl} from "../NgFormControl";


@Component({
    selector     : 'radio',
    template     : `
        <ng-container *ngIf="initialized">
            <div class="form-group validate-input">
                <label *ngIf="labelPlacement === 'above'">
                    {{ label }}
                </label>
                <div></div>
                <div (click)="check();" class="input-group check-container" tabindex="0" #element
                     [class.label-above]="labelPlacement === 'above'">
                <span class="form-control" *ngIf="labelPlacement === 'before'">
                    <label>
                        {{ label }}
                    </label>
                </span>
                    <div class="input-group-addon ng-control"
                         [ngClass]="{'ng-invalid':(isInvalid$() | async), 'ng-touched':(touched$ | async), 'ng-valid':!(isInvalid$() | async) && (touched$ | async)}">
                        <input readonly type="radio"
                               [id]="identifier"
                               [disabled]="disabled"
                               [checked]="value === checkedValue"
                               tabindex="-1"/>
                    </div>
                    <span class="form-control" *ngIf="labelPlacement === 'after'">
                    <label>
                        {{ label }}
                    </label>
                </span>
                </div>
            </div>
        </ng-container>
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

    @Input() name: string           = '';
    @Input() label: string          = '';
    @Input() parentFormControl: FormControl;
    @Input() parentFormGroup: FormGroup;
    @Input() labelPlacement: string = 'after';
    @Input() checkedValue: any      = true;
    @Input() disabled: boolean      = false;
             required: boolean      = false;

    identifier = `radio-${identifier++}`;

    @Output() onTouch = new EventEmitter<any>();

    @ViewChild("element") element;

    shouldValidate = false;

    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }
    onLoad() {
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

}

let identifier = 0;
