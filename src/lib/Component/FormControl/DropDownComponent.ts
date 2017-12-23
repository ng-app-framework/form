import {
    ViewEncapsulation, Component, Input, Output, EventEmitter, OnInit, OnDestroy, Injector,
    Inject, Optional, ViewChild, ContentChild, TemplateRef
} from '@angular/core';
import {NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {OnChange, Value} from "@ng-app-framework/core";
import {NgSelectComponent} from "@ng-select/ng-select";
import {NgFormControl} from "../NgFormControl";

@Component({
    selector     : 'drop-down',
    template     : `
        <ng-template #defaultOption let-item>
            {{ item.text }}
        </ng-template>
        <div class="form-group" [class.validate-input]="shouldValidate">
            <validation-messages *ngIf="(invalid) && model.control.touched" [messages]="failures">
            </validation-messages>
            <label [attr.for]="identifier">
                {{ label }}
                <ng-container *ngIf="required">*</ng-container>
            </label>
            <div></div>
            <div class="input-group">
                <span class="input-group-addon" *ngIf="isIconProvided() && isIconPlacementBefore()">
                    <span class="fa fa-{{icon}}"></span>
                </span>
                <ng-select
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
                <span class="input-group-addon" *ngIf="isIconProvided() && !isIconPlacementBefore()">
                    <span class="fa fa-{{icon}}"></span>
                </span>
            </div>
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
            useExisting: DropDownComponent,
            multi      : true
        }
    ],
    encapsulation: ViewEncapsulation.None
})
export class DropDownComponent extends NgFormControl<any> implements OnInit, OnDestroy {

    @Input() @ContentChild(TemplateRef) template;
    @ViewChild('ngSelect') ngSelect: NgSelectComponent;

    private _isMultiple = false;

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


    @Input() icon: string          = '';
    @Input() iconPlacement: string = 'before';

    isInitialized = false;

    identifier = `option-list-${identifier++}`;


    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
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


    isIconProvided() {
        return this.icon.length > 0;
    }

    isIconPlacementBefore() {
        return this.iconPlacement === 'before';
    }
}

let identifier = 0;
