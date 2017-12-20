import {ViewEncapsulation, Component, Input, Injector, Inject, Optional, ViewChild} from '@angular/core';
import {NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SiteConfig} from "@ng-app-framework/core";
import 'rxjs/Rx';
import {BsDatepickerDirective} from "ngx-bootstrap/datepicker";
import {NgFormControl} from "../NgFormControl";


@Component({
    selector     : 'date-picker',
    template     : `
        <div class="form-group">
            <validation-messages *ngIf="(invalid) && model.control.touched" [messages]="failures">
            </validation-messages>
            <label [attr.for]="identifier">
                {{label}}
                <ng-container *ngIf="required">*</ng-container>
            </label>
            <div class="input-group">
                <span class="input-group-btn">
                    <button class="btn btn-outline-primary" type="button" (click)="!disabled ? dp.toggle() : null"
                            [disabled]="disabled">
                        <span class="fa fa-calendar"></span>
                    </button>
                </span>
                <input type="text" bsDatepicker #dp="bsDatepicker"
                       [bsConfig]="{containerClass: theme,weeks:false}"
                       [(ngModel)]="value" class="form-control ng-control" [name]="name" [attr.id]="identifier"
                       [minDate]="minDate"
                       [ngClass]="{'ng-invalid': (invalid) && model.control.touched, 'ng-touched':model.control.touched, 'ng-valid':!(invalid) && model.control.touched}"
                       [maxDate]="maxDate" [disabled]="disabled"/>
            </div>
        </div>
    `,
    styleUrls    : ['./assets/date-picker.scss'],
    providers    : [
        {
            provide    : NG_VALUE_ACCESSOR,
            useExisting: DatePickerComponent,
            multi      : true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent extends NgFormControl<string> {

    @Input() name: string      = '';
    @Input() label: string     = '';
    @Input() theme: string     = '';
    @Input() required: boolean = false;
    @Input() disabled: boolean = false;

    @Input() minDate: Date;
    @Input() maxDate: Date;

    @ViewChild('dp') datePicker: BsDatepickerDirective;

    constructor(@Inject(Injector) public injector: Injector,
                @Optional() @Inject(NG_VALIDATORS)  validators: Array<any>,
                @Optional() @Inject(NG_ASYNC_VALIDATORS)  asyncValidators: Array<any>) {
        super(injector, validators, asyncValidators);
    }

    identifier = `date-picker-${identifier}`;

    ngOnInit() {
        this.theme = this.theme.length > 0 ? this.theme : SiteConfig.theme;
        super.ngOnInit();
        this.valueChange.takeUntil(this.onDestroy$)
            .subscribe(value => {
                this.model.control.markAsTouched();
            })
    }

}

let identifier = 0;
