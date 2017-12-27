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
        <div class="form-group">
            <validation-messages *ngIf="(invalid) && model.control.touched" [messages]="failures">
            </validation-messages>
            <label>
                {{label}}
            </label>
            <div></div>
            <text-box [hidden]="!areOptionsInitialized" name="nested-check-box-search" class="full-width"
                      [(ngModel)]="searcher.search"
                      placeholder="Search ..." icon="search"
                      shouldValidate="false"></text-box>
            <ng-container *ngIf="areOptionsInitialized">
                <nested-list class="form-control expandable" #scrollable
                             [element]="{children: initializedOptions}"
                             [showLines]="false"
                             [onCollapseAll]="onCollapseAll"
                             [onExpandAll]="onExpandAll" [shouldDisplay$]="shouldDisplay$">
                    <ng-template let-item>
                        <check-box #checkbox [threeState]="hasChildren(item)"
                                   (onInit)="item.checkbox = checkbox"
                                   [shouldValidate]="false"
                                   [class.bold]="shouldBold$(item) | async"
                                   labelPlacement="after"
                                   [(ngModel)]="selection[item[selectBy]]"
                                   (ngModelChange)="control.markAsTouched()"
                                   (stateChange)="updateChildrenOfItem(item, $event).subscribe()"
                                   [name]="item.name"
                                   [label]="item.name">
                        </check-box>
                    </ng-template>
                </nested-list>
            </ng-container>
        </div>
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

    @ViewChild('scrollable') scrollable;

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
        validate: (control:AbstractControl) => {
            if (this.required && (!control.value || control.value.length === 0)) {
                return {required:true};
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
            this.triggerValidate();
        }
    }

    shouldBold$(item) {
        return Observable.of(this.searcher.isTermLongEnough() && this.searcher.doesItemMatchSearch(item)).debounceTime(500);
    }

    hasChildren(item) {
        return Value.hasArrayElements(item.children);
    }

    shouldDisplay$ = (item): Observable<boolean> => {
        return this.searcher.doesItemMatchSearch$(item).flatMap(value => {
            if (!value) {
                return this.searcher.doesParentMatchSearch$(item);
            }
            return Async.getObservableForValue$(true);
        });
    };

    updateChildrenOfItem(item, checkedStatus, top = null): Observable<any> {
        top = top || item;
        return Observable.from(item.children || [])
            .flatMap((child: { [key: string]: any }) => {
                child.checkbox.state = top.checkbox.state !== 'indeterminate' ? top.checkbox.state : child.checkbox.state;
                return this.updateChildrenOfItem(child, checkedStatus, top);
            });
    }
}
