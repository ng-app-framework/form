import {
    ViewEncapsulation, Component, Input, Output, EventEmitter, OnInit, OnDestroy, Injector,
    Inject, Optional, ViewChild, ContentChild, TemplateRef
} from '@angular/core';
import {NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {OnChange, Value} from "@ng-app-framework/core";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgFormControl} from "../NgFormControl";

@Component({
    selector     : 'option-list',
    template     : `
        <ng-template #defaultOption let-item>
            {{ item.text }}
        </ng-template>
        <div class="form-group">
            <validation-messages *ngIf="(invalid) && model.control.touched" [messages]="failures">
            </validation-messages>
            <label [attr.for]="identifier">
                {{ label }}
                <ng-container *ngIf="required">*</ng-container>
            </label>
            <ng-select [hidden]="!areOptionsProvided() || !isInitialized"
                       [items]="options"
                       [disabled]="disabled"
                       [typeahead]="typeahead || null"
                       [bindValue]="selectBy"
                       [bindLabel]="labelField"
                       [multiple]="isMultiple"
                       [ngClass]="{'ng-invalid': (invalid) && model.control.touched, 'ng-touched':model.control.touched, 'ng-valid':!(invalid) && model.control.touched}"
                       [placeholder]="placeholder"
                       [(ngModel)]="value"
                       #ngSelect
            >
                <ng-template ng-option-tmp let-item="item">
                    <ng-container
                            *ngTemplateOutlet="template ? template : defaultOption;context:{$implicit: item}"></ng-container>
                </ng-template>
            </ng-select>
        </div>
        <ng-container *ngIf="!areOptionsProvided()">
            <div class="alert alert-notice">
                There are no options available.
            </div>
        </ng-container>
    `,
    styleUrls    : ['./assets/ng2-select.scss'],
    providers    : [
        {
            provide    : NG_VALUE_ACCESSOR,
            useExisting: OptionListComponent,
            multi      : true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class OptionListComponent extends NgFormControl<any> implements OnInit, OnDestroy {

    @Input() @ContentChild(TemplateRef) template;

    @Input()
    public get isMultiple(): boolean {
        return this._isMultiple;
    }

    public set isMultiple(value: boolean) {
        this._isMultiple = value;
        if (this.isInitialized) {
            setTimeout(() => {
                this.onMultipleChange();
            });
        }
    }

    @Input() name: string                                    = '';
    @Input() label: string                                   = '';
    @Input() required: boolean                               = false;
    @Input() disabled: boolean                               = false;
    @Input() placeholder                                     = 'Select ...';
    @Input() options: { text: string, [key: string]: any }[] = [];
    @Input() selectBy: string                                = 'id';
    @Input() labelField: string                              = 'text';

    @Input() typeahead: EventEmitter<string> = new EventEmitter<string>();

    private _isMultiple = false;

    onDestroy$ = new EventEmitter<any>();

    @ViewChild('ngSelect') ngSelect: NgSelectComponent;

    isInitialized = false;

    identifier = `option-list-${identifier++}`;


    constructor(@Inject(Injector) public injector: Injector,
                @Optional() @Inject(NG_VALIDATORS)  validators: Array<any>,
                @Optional() @Inject(NG_ASYNC_VALIDATORS)  asyncValidators: Array<any>) {
        super(injector, validators, asyncValidators);
    }

    ngOnInit() {
        super.ngOnInit();
        this.isInitialized = true;
        this.ngSelect.blurEvent.merge(this.ngSelect.changeEvent).takeUntil(this.onDestroy$).subscribe(() => {
            this.model.control.markAsTouched();
        });
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
        this.isInitialized = false;
    }

    onMultipleChange() {
        if (this.isMultiple) {
            if (!Array.isArray(this.value)) {
                this.value = [this.value];
            }
            return;
        }
        if (Array.isArray(this.value)) {
            this.value = this.value[0] || null;
        }
    }

    areOptionsProvided() {
        return Value.hasArrayElements(this.options);
    }
}

let identifier = 0;
