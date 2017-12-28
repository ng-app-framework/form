import {
    ViewEncapsulation,
    Component,
    Input,
    Injector,
    Inject,
    ViewChild,
    ElementRef,
} from '@angular/core';
import {FormControl, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {SiteConfig, Value} from "@ng-app-framework/core";
import {BsDatepickerDirective} from "ngx-bootstrap/datepicker";
import {Observable} from "rxjs/Rx";
import {NgFormControl} from "../NgFormControl";


@Component({
    selector     : 'date-picker',
    template     : `
        <div class="form-group" [class.validate-input]="shouldValidate" [class.no-validate-input]="!shouldValidate" [hidden]="!initialized">
            <validation-messages *ngIf="isInvalid()" [errors]="failures" [label]="label">
            </validation-messages>
            <label [attr.for]="identifier" *ngIf="label.length > 0">
                {{label}}
                <ng-container *ngIf="required">*</ng-container>
            </label>
            <div></div>
            <div class="input-group ng-control"
                 [ngClass]="{'ng-invalid': isInvalid(), 'ng-touched':isTouched(), 'ng-valid':!isInvalid()}">
                <span class="input-group-addon before-input clickable" (click)="open()">
                        <span class="fa fa-calendar"></span>
                </span>
                <input class="form-control" type="text"
                       [placeholder]="placeholder || ''"
                       [id]="identifier"
                       [name]="name"
                       [disabled]="disabled"
                       [(ngModel)]="value"
                       #input

                       bsDatepicker
                       #dp="bsDatepicker"
                       [triggers]="''"
                       [bsConfig]="{containerClass: theme,weeks:false}"
                       [minDate]="minDate"
                       [maxDate]="maxDate"
                       (blur)="onBlur()"
                />
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
    @Input() required: boolean;
    @Input() disabled: boolean = false;
    @Input() parentFormControl: FormControl;
    @Input() parentFormGroup: FormGroup;

    @Input() minDate: Date;
    @Input() maxDate: Date;

    @Input() shouldValidate: boolean = true;
    @Input() placeholder: string     = '';

    @ViewChild('input') input: ElementRef;
    @ViewChild('dp') datePicker: BsDatepickerDirective;

    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
    }

    identifier = `date-picker-${identifier}`;

    ngOnInit() {
        this.theme = this.theme.length > 0 ? this.theme : SiteConfig.theme;
        super.ngOnInit();
        Observable.fromEvent(this.input.nativeElement, 'keydown')
            .takeUntil(this.onDestroy$)
            .subscribe((event: KeyboardEvent) => {
                this.close();
            });

        Observable.fromEvent(this.input.nativeElement, 'focus')
            .takeUntil(this.onDestroy$)
            .subscribe(() => {
                this.open();
            })
    }

    open() {
        this.datePicker.hide();
        if (!this.datePicker.isOpen) {
            this.datePicker.show();
        }
    }

    close() {
        if (this.datePicker.isOpen) {
            this.datePicker.hide();
        }
    }


}

let identifier = 0;
