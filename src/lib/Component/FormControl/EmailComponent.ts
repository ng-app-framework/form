import {Component, Inject, Input, Optional, ViewChild, ViewEncapsulation, Injector} from '@angular/core';
import {NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel} from "@angular/forms";
import 'rxjs/Rx';
import {OptionalEmailValidator} from "../../Validation/Directive/OptionalEmailValidator";
import {NgFormControl} from "../NgFormControl";

@Component({
    selector     : 'email',
    template     : `
        <div class="form-group">
            <validation-messages *ngIf="(invalid) && model.control.touched" [messages]="failures">
            </validation-messages>
            <label [attr.for]="identifier">
                {{label}}
                <ng-container *ngIf="required">*</ng-container>
            </label>
            <div class="input-group">
                <span class="input-group-addon">
                    <span class="fa fa-envelope"></span>
                </span>
                <input class="form-control ng-control" type="email"
                       #input
                       [placeholder]="placeholder"
                       [id]="identifier"
                       [name]="name"
                       [disabled]="disabled"
                       [ngClass]="{'ng-invalid': (invalid) && model.control.touched, 'ng-touched':model.control.touched, 'ng-valid':!(invalid) && model.control.touched}"
                       [(ngModel)]="value"
                       (blur)="model.control.markAsTouched()"
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

    @Input() name: string        = null;
    @Input() required: boolean   = false;
    @Input() disabled: boolean   = false;
    @Input() label: string       = '';
    @Input() placeholder: string = null;

    @ViewChild('input') input;

    protected additionalValidators = [new OptionalEmailValidator()];

    protected identifier = `email-${identifier++}`;

    constructor(public injector: Injector,
                @Optional() @Inject(NG_VALIDATORS)  defaultValidators: Array<any>,
                @Optional() @Inject(NG_ASYNC_VALIDATORS)  asyncValidators: Array<any>) {
        super(injector, defaultValidators, asyncValidators);
    }

    ngOnInit() {
        super.ngOnInit();
    }

}

let identifier = 0;
