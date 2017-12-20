import {Component, Inject, Input, Optional, ViewChild, ViewEncapsulation, Injector} from '@angular/core';
import {FormControl, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel} from "@angular/forms";
import {OnChange} from "@ng-app-framework/core";
import {NgFormControl} from "../NgFormControl";
import {TextBoxComponent} from './TextBoxComponent';

@Component({
    selector     : 'email',
    template     : `
        <text-box [placeholder]="placeholder"
                  [class.validate]="shouldValidate"
                  [name]="name"
                  [label]="label"
                  [invalid]="invalid"
                  [failures]="failures"
                  [email]="isValueProvided"
                  icon="envelope"
                  [disabled]="disabled"
                  [(ngModel)]="value"
                  [shouldValidate]="false"
                  [parentFormControl]="control"
        ></text-box>
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

    @Input() name: string                 = null;
    @OnChange @Input() required: boolean  = false;
    @OnChange @Input() disabled: boolean  = false;
    @Input() parentFormControl: FormControl;
    @Input() label: string                = '';
    @Input() placeholder: string          = null;
    @Input() shouldValidate               = true;
    @OnChange @Input() invalid: boolean   = false;
    @OnChange @Input() failures: string[] = [];


    @ViewChild('textBox') textBox: TextBoxComponent;

    constructor(public injector: Injector,
                @Optional() @Inject(NG_VALIDATORS)  defaultValidators: Array<any>,
                @Optional() @Inject(NG_ASYNC_VALIDATORS)  asyncValidators: Array<any>) {
        super(injector, defaultValidators, asyncValidators);
    }


}
