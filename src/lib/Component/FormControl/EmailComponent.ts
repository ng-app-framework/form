import {Component, Input, ViewChild, ViewEncapsulation, Injector} from '@angular/core';
import {AbstractControl, FormControl, NG_VALUE_ACCESSOR, Validators, FormGroup} from "@angular/forms";
import {OnChange} from "@ng-app-framework/core";
import {NgFormControl} from "../NgFormControl";
import {TextBoxComponent} from './TextBoxComponent';

@Component({
    selector     : 'email',
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
            <span class="input-group-addon before-input">
                <span class="fa fa-envelope"></span>
            </span>
                <input class="form-control" 
                       type="text"
                       [placeholder]="placeholder || ''"
                       [id]="identifier"
                       [name]="name"
                       [disabled]="disabled"
                       [(ngModel)]="value"
                       (blur)="onBlur()"
                />
            </div>
        </div>
    `,
    styleUrls    : ['./assets/field.scss'],
    providers    : [{
        provide    : NG_VALUE_ACCESSOR,
        useExisting: EmailComponent,
        multi      : true
    }],
    encapsulation: ViewEncapsulation.None
})
export class EmailComponent extends NgFormControl<string> {

    @Input() name: string                = null;
    @OnChange @Input() required: boolean = false;
    @OnChange @Input() disabled: boolean = false;
    @Input() parentFormControl: FormControl;
    @Input() parentFormGroup: FormGroup;
    @Input() label: string               = '';
    @Input() placeholder: string         = null;
    @Input() shouldValidate              = true;

    additionalValidators = [
        {
            validate: (control: AbstractControl) => {
                return this.isProvided() ? Validators.email(control) : null;
            }
        }
    ];


    @ViewChild('textBox') textBox: TextBoxComponent;

    constructor(public injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    isProvided() {
        return this.value && this.value.length > 0;
    }
}
