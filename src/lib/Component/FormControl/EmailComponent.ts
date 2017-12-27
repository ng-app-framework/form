import {Component, Input, ViewChild, ViewEncapsulation, Injector} from '@angular/core';
import {FormControl, NG_VALUE_ACCESSOR} from "@angular/forms";
import {OnChange} from "@ng-app-framework/core";
import {NgFormControl} from "../NgFormControl";
import {TextBoxComponent} from './TextBoxComponent';

@Component({
    selector     : 'email',
    template     : `
        <text-box [placeholder]="placeholder"
                  [class.validate-input]="shouldValidate"
                  [name]="name"
                  [label]="label"
                  [(invalid)]="invalid"
                  [(failures)]="failures"
                  [email]="isProvided()"
                  [disabled]="disabled"
                  [(ngModel)]="value"
                  [shouldValidate]="false"
                  [parentFormControl]="control"
                  (inputFocusOut)="triggerValidate()"
        >
            <span class="input-group-addon before-input">
                <span class="fa fa-envelope"></span>
            </span>
        </text-box>
        <pre>invalid: {{invalid}} - failures: {{failures | json}}</pre>
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

    constructor(public injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    triggerValidate() {
        console.log(this.shouldValidate, this.initialized);
        if (this.shouldValidate && this.initialized) {
            console.log(this.label, 'validating');
            this.validate()
                .distinctUntilChanged()
                .subscribe(errors => {
                    this.updateValidityFlags(errors);
                    console.log(this.label, errors);
                });
        }
    }
    isProvided() {
        return this.value && this.value.length > 0;
    }
}
