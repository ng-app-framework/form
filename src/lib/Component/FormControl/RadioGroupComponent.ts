import {
    ViewEncapsulation, Component, Input, EventEmitter, ViewChild, OnInit, OnDestroy,
    Inject, Injector
} from '@angular/core';
import {
    NG_VALUE_ACCESSOR, RequiredValidator
} from "@angular/forms";
import {OnChange} from "@ng-app-framework/core";
import {NgFormControl} from "../NgFormControl";


@Component({
    selector     : 'radio-group',
    template     : `
        <div class="form-group">
            <validation-messages *ngIf="(invalid) && control.touched" [messages]="failures">
            </validation-messages>
            <label>
                {{ label }}
                <span *ngIf="required">*</span>
            </label>
            <div></div>
            <div class="radio-controls" [class.d-flex]="direction === 'horizontal'">
                <ng-container *ngFor="let option of options">
                    <radio [name]="name" [label]="option[bindLabel]" [(ngModel)]="value" [invalid]="invalid"
                           [checkedValue]="option[bindValue]" [parentFormControl]="control"
                           (onTouch)="control.markAsTouched()"></radio>
                </ng-container>
            </div>
        </div>
    `,
    styleUrls    : ['./assets/check-box.scss'],
    providers    : [
        {
            provide    : NG_VALUE_ACCESSOR,
            useExisting: RadioGroupComponent,
            multi      : true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class RadioGroupComponent extends NgFormControl<any> implements OnInit, OnDestroy {

    @OnChange @Input() state = 'off';

    @Input() name: string                         = '';
    @Input() label: string                        = '';
    @Input() disabled: boolean                    = false;
    @Input() bindLabel: string                    = 'label';
    @Input() bindValue: string                    = 'value';
    @OnChange @Input() required: boolean          = false;
    @Input() direction: 'horizontal' | 'vertical' = 'horizontal';

    @Input() options: { label: string, value: any }[] = [];

    identifier = `radio-group-${identifier++}`;

    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
    }

}

let identifier = 0;