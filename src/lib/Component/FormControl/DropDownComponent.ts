import {
    ViewEncapsulation, Component, Input, EventEmitter, OnInit, OnDestroy, Injector,
    Inject, ViewChild, ContentChild, TemplateRef
} from '@angular/core';
import {FormControl, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {Value} from "@ng-app-framework/core";
import {NgFormControl} from "../NgFormControl";

@Component({
    selector     : 'drop-down',
    template     : `
        <ng-template #defaultOption let-item>
            {{ item.text }}
        </ng-template>
        <div class="form-group" [class.validate-input]="shouldValidate">
            <validation-messages *ngIf="isInvalid()" [messages]="failures">
            </validation-messages>
            <label [attr.for]="identifier">
                {{ label }}
                <ng-container *ngIf="required">*</ng-container>
            </label>
            <div></div>
            <div class="input-group ng-control"
                 [ngClass]="{'ng-invalid': isInvalid(), 'ng-touched':isTouched(), 'ng-valid':!(isInvalid()) && isTouched()}"
                 *ngIf="initialized">
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
                        [placeholder]="placeholder"
                        [(ngModel)]="value"
                        (blur)="triggerValidate();control.markAsTouched()"
                        (change)="triggerValidate();control.markAsTouched()"
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

    private _isMultiple = false;

    @Input()
    public get isMultiple(): boolean {
        return this._isMultiple;
    }

    public set isMultiple(value: boolean) {
        this._isMultiple = value;
        if (this.initialized) {
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
    @Input() parentFormControl: FormControl;
    @Input() parentFormGroup: FormGroup;

    @Input() typeahead: EventEmitter<string> = new EventEmitter<string>();


    @Input() icon: string          = '';
    @Input() iconPlacement: string = 'before';


    identifier = `option-list-${identifier++}`;


    constructor(@Inject(Injector) public injector: Injector) {
        super(injector);
    }

    ngOnInit() {
        super.ngOnInit();
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
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
