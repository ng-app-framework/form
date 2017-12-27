import {
    Component, Input, ViewChild, ViewEncapsulation, Injector,
    Output, EventEmitter
} from '@angular/core';
import {NG_VALUE_ACCESSOR, FormControl, FormGroup} from "@angular/forms";
import {OnChange} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";
import {NgFormControl} from "../NgFormControl";

@Component({
    selector     : 'text-box',
    template     : `
        <div class="form-group" [class.validate-input]="shouldValidate" [hidden]="!initialized">
            <validation-messages *ngIf="isInvalid()" [messages]="failures">
            </validation-messages>
            <label [attr.for]="identifier" *ngIf="label.length > 0">
                {{label}}
                <ng-container *ngIf="required">*</ng-container>
            </label>
            <div></div>
            <div class="input-group ng-control" (click)="click.emit()"
                 [ngClass]="{'ng-invalid': isInvalid(), 'ng-touched':isTouched(), 'ng-valid':!isInvalid()}">
                <ng-content select=".before-input"></ng-content>
                <input class="form-control" type="text" #input
                       (focus)="inputFocus.emit()"
                       [placeholder]="placeholder || ''"
                       [id]="identifier"
                       [name]="name"
                       [disabled]="disabled"
                       [(ngModel)]="value"
                       (blur)="onBlur()"
                />
                <ng-content select=".after-input"></ng-content>
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
    @Input() parentFormGroup: FormGroup;
    @Input() label: string                = '';
    @Input() placeholder: string          = null;
    @Input() shouldValidate               = true;
    @OnChange @Input() invalid: boolean   = false;
    @OnChange @Input() failures: string[] = [];
    @Output() click                       = new EventEmitter<any>();
    @Output() inputClick                  = new EventEmitter<any>();
    @Output() inputFocusOut               = new EventEmitter<any>();
    @Output() inputFocus                  = new EventEmitter<any>();

    @Input() format: { regex: RegExp | RegExp[], replacement: string | Function };

    @ViewChild("input") input;

    protected identifier = `text-box-${identifier++}`;

    constructor(public injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
        Observable.fromEvent(this.input.nativeElement, 'keydown')
            .takeUntil(this.onDestroy$)
            .subscribe((event: KeyboardEvent) => {
                if (event.key === 'Tab') {
                    this.onBlur();
                }
            });
    }

    protected onBlur() {
        this.control.markAsTouched();
        this.inputFocusOut.emit();
    }
}

let identifier = 0;
