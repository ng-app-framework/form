import {
    ViewEncapsulation, Component, Input, EventEmitter, OnDestroy, OnInit, ViewChild,
    Injector, KeyValueDiffers, KeyValueDiffer, DoCheck
} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NestedSearcher} from "../../Service/Impl/NestedSearcher";
import {Async, OnChange, Value} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";
import {NgFormControl} from "../NgFormControl";

@Component({
    selector     : 'nested-check-box',
    template     : `
        <ng-container *ngIf="initialized">
            <div class="form-group" [class.validate-input]="shouldValidate" [class.no-validate-input]="!shouldValidate">
                <validation-messages *ngIf="(isInvalid$() | async)" [errors]="failures$ | async" [label]="label">
                </validation-messages>
                <label>
                    {{label}}
                </label>
                <div></div>
                <ng-container *ngIf="areOptionsInitialized">
                    <nested-list
                            class="form-control-container"
                            [ngClass]="{'ng-invalid':(isInvalid$() | async), 'ng-touched':(touched$ | async), 'ng-valid':!(isInvalid$() | async)}"
                            [item]="{children: initializedOptions}"
                            [containerClass]="'form-control expandable ng-control'"
                            [showLines]="false"
                            [onCollapseAll]="onCollapseAll"
                            [onExpandAll]="onExpandAll"
                            [searchBy]="searchBy">
                        <ng-template let-item>
                            <check-box #checkbox [threeState]="hasChildren(item)"
                                       *ngIf="item.name"
                                       (onInit)="item.checkbox = checkbox"
                                       [shouldValidate]="false"
                                       labelPlacement="after"
                                       [(ngModel)]="selection[item[selectBy]]"
                                       (ngModelChange)="control.markAsTouched()"
                                       (stateChange)="updateChildrenOfItem(item, $event).subscribe()"
                                       [name]="item.name"
                                       [label]="item.name"
                                       [hidden]="searcher.search.length > 0 && !item['$matches'] && !item['$parentMatches']">
                            </check-box>
                        </ng-template>
                    </nested-list>
                </ng-container>
            </div>
        </ng-container>
    `,
    styleUrls    : ['./assets/nested-select.scss'],
    providers    : [{
        provide    : NG_VALUE_ACCESSOR,
        useExisting: NestedCheckBoxComponent,
        multi      : true
    }],
    encapsulation: ViewEncapsulation.None
})
export class NestedCheckBoxComponent extends NgFormControl<any[]> implements OnInit, OnDestroy, DoCheck {


    @Input() name: string                = null;
    @OnChange @Input() required: boolean = false;
    @OnChange @Input() disabled: boolean = false;
    @Input() parentFormControl: FormControl;
    @Input() parentFormGroup: FormGroup;
    @Input() label: string               = '';
    @Input() placeholder: string         = null;
    @Input() shouldValidate              = true;

    onCollapseAll = new EventEmitter<any>();
    onExpandAll   = new EventEmitter<any>();

    @Input() options: any[] = [];

    @Input() selectBy: string   = 'id';
    @Input() searchBy: string[] = ['name'];

    protected selection: { [key: string]: any } = {};
    protected initializedOptions                = [];
    protected searcher: NestedSearcher;

    protected selectionDiffer: KeyValueDiffer<string, boolean>;

    additionalValidators = [{
        validate: (control: AbstractControl) => {
            if (this.required && (!control.value || control.value.length === 0)) {
                return {required: true};
            }
            return null;
        }
    }];

    constructor(differs: KeyValueDiffers,
                public injector: Injector) {
        super(injector);
        this.selectionDiffer = differs.find({}).create();
    }

    areOptionsInitialized = false;

    shouldDisplay = {};

    initializeOption(list, parent = null) {
        for (let option of list) {
            option.parent                         = parent;
            this.selection[option[this.selectBy]] = this.value.indexOf(option[this.selectBy]) > -1;

            if (this.hasChildren(option)) {
                this.initializeOption(option.children, option);
            }
        }

    }

    ngOnInit() {
        this.areOptionsInitialized = false;
        super.ngOnInit();
        this.searcher = new NestedSearcher(this.searchBy);
        this.initializeOptions();
    }

    initializeOptions() {
        setTimeout(() => {
            let copy = JSON.parse(JSON.stringify(this.options));
            this.initializeOption(copy);
            this.initializedOptions    = copy;
            this.areOptionsInitialized = true;
        });
    }

    ngDoCheck() {
        const changes = this.selectionDiffer.diff(this.selection);
        if (changes && this.areOptionsInitialized) {
            this.value = Object.keys(this.selection).filter(key => this.selection[key]);
        }
    }

    shouldBold$(item) {
        return Observable.of(this.searcher.isTermLongEnough() && this.searcher.doesItemMatchSearch(item)).debounceTime(500);
    }

    hasChildren(item) {
        return Value.hasArrayElements(item.children);
    }

    updateChildrenOfItem(item, checkedStatus, top = null): Observable<any> {
        top = top || item;
        return Observable.from(item.children || [])
            .flatMap((child: { [key: string]: any }) => {
                child.checkbox.state = top.checkbox.state !== 'indeterminate' ? top.checkbox.state : child.checkbox.state;
                return this.updateChildrenOfItem(child, checkedStatus, top);
            });
    }
}
