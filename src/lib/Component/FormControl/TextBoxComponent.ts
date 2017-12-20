import {
    Component, Inject, Input, Optional, ViewChild, ViewEncapsulation, Injector,
    ChangeDetectorRef
} from '@angular/core';
import {NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgModel, FormControl} from "@angular/forms";
import 'rxjs/Rx';
import {OnChange} from "@ng-app-framework/core";
import {NgFormControl} from "../NgFormControl";

@Component({
    selector     : 'text-box',
    template     : `
        <div class="form-group" [class.validate]="shouldValidate" *ngIf="initialized">
            <validation-messages *ngIf="isInvalid()" [messages]="failures">
            </validation-messages>
            <label [attr.for]="identifier" *ngIf="label.length > 0">
                {{label}}
                <ng-container *ngIf="required">*</ng-container>
            </label>
            <ng-container *ngIf="!isIconProvided()">
                <input class="form-control ng-control" type="text"
                       [placeholder]="placeholder || ''"
                       [id]="identifier"
                       [name]="name"
                       [disabled]="disabled"
                       [ngClass]="{'ng-invalid': isInvalid(), 'ng-touched':isTouched(), 'ng-valid':!isInvalid()}"
                       [(ngModel)]="value"
                       (blur)="control.markAsTouched()"
                />
            </ng-container>
            <div class="input-group" *ngIf="isIconProvided()">
                <span class="input-group-addon" *ngIf="isIconPlacementBefore()">
                    <span class="fa fa-{{icon}}"></span>
                </span>
                <input class="form-control ng-control" type="text"
                       [placeholder]="placeholder || ''"
                       [id]="identifier"
                       [name]="name"
                       [disabled]="disabled"
                       [ngClass]="{'ng-invalid': isInvalid(), 'ng-touched':isTouched(), 'ng-valid':!isInvalid()}"
                       [(ngModel)]="value"
                       (blur)="control.markAsTouched()"
                />
                <span class="input-group-addon" *ngIf="!isIconPlacementBefore()">
                    <span class="fa fa-{{icon}}"></span>
                </span>
            </div>
        </div>
    `,
    styleUrls    : ['./assets/field.scss'],
    providers    : [{
        provide    : NG_VALUE_ACCESSOR,
        useExisting: TextBoxComponent,
        multi      : true
    }],
    encapsulation: ViewEncapsulation.None
})
export class TextBoxComponent extends NgFormControl<string> {

    @Input() name: string                 = null;
    @OnChange @Input() required: boolean  = false;
    @OnChange @Input() disabled: boolean  = false;
    @Input() parentFormControl: FormControl;
    @Input() label: string                = '';
    @Input() placeholder: string          = null;
    @Input() shouldValidate               = true;
    @OnChange @Input() invalid: boolean   = false;
    @OnChange @Input() failures: string[] = [];

    @Input() icon: string          = '';
    @Input() iconPlacement: string = 'before';

    protected identifier           = `text-box-${identifier++}`;
              additionalValidators = [];

    constructor(public injector: Injector,
                public cdr: ChangeDetectorRef,
                @Optional() @Inject(NG_VALIDATORS)  defaultValidators: Array<any>,
                @Optional() @Inject(NG_ASYNC_VALIDATORS)  asyncValidators: Array<any>) {
        super(injector, defaultValidators, asyncValidators);
    }

    isInvalid() {
        return this.invalid && this.isTouched();
    }

    isTouched() {
        return this.control.touched;
    }

    isIconProvided() {
        return this.icon.length > 0;
    }

    isIconPlacementBefore() {
        return this.iconPlacement === 'before';
    }
}

let identifier = 0;
