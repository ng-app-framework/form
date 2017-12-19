import {
    ViewEncapsulation, Component, Input, EventEmitter, OnDestroy, OnInit, ViewChild,
    Optional, Inject, Injector, KeyValueDiffers, KeyValueDiffer, DoCheck
} from '@angular/core';
import {NG_ASYNC_VALIDATORS, NG_VALIDATORS, NG_VALUE_ACCESSOR} from "@angular/forms";
import {NestedSearcher} from "../../Service/Impl/NestedSearcher";
import {Async, Value} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";
import {NgFormControl} from "../NgFormControl";

@Component({
    selector     : 'nested-option-list',
    template     : `
        <div class="form-group">
            <validation-messages *ngIf="(invalid) && model.control.touched" [messages]="failures">
            </validation-messages>
            <label>
                {{label}}
            </label>
            <ng-container *ngIf="isInitialized">
                <input type="text" [(ngModel)]="searcher.search" class="form-control" placeholder="Search..."/>
                <div class="form-control expandable" #scrollable>
                    <nested-list [element]="{children: initializedOptions}"
                                 [onCollapseAll]="onCollapseAll"
                                 [onExpandAll]="onExpandAll" [shouldDisplay$]="shouldDisplay$">
                        <ng-template let-item>
                            <div [class.bold]="shouldBold$(item) | async"
                                 class="form-check">
                                <check-box #checkbox [threeState]="hasChildren(item)"
                                           (onInit)="item.checkbox = checkbox"
                                           labelPlacement="after"
                                           [(state)]="item.state"
                                           [(ngModel)]="selection[item[selectBy]]"
                                           (ngModelChange)="updateChildrenOfItem(item, $event).subscribe()"
                                           [name]="item.name"
                                           [label]="item.name">
                                </check-box>
                            </div>
                        </ng-template>
                    </nested-list>
                </div>
            </ng-container>
        </div>
    `,
    styleUrls    : ['./assets/nested-select.scss'],
    providers    : [{
        provide    : NG_VALUE_ACCESSOR,
        useExisting: NestedOptionListComponent,
        multi      : true
    }],
    encapsulation: ViewEncapsulation.None
})
export class NestedOptionListComponent extends NgFormControl<any[]> implements OnInit, OnDestroy, DoCheck {

    @ViewChild('scrollable') scrollable;

    onCollapseAll              = new EventEmitter<any>();
    onExpandAll                = new EventEmitter<any>();
    @Input() name: string      = '';
    @Input() label: string     = '';
    @Input() options: any[]    = [];
    @Input() required: boolean = false;
    @Input() disabled: boolean = false;

    @Input() selectBy: string                  = 'id';
    @Input() searchBy: string[]                = ['name'];
             selection: { [key: string]: any } = {};
             initializedOptions                = [];
             searcher: NestedSearcher;

    selectionDiffer: KeyValueDiffer<string, boolean>;

    isInitialized = false;


    constructor(differs: KeyValueDiffers,
                public injector: Injector,
                @Optional() @Inject(NG_VALIDATORS)  validators: Array<any>,
                @Optional() @Inject(NG_ASYNC_VALIDATORS)  asyncValidators: Array<any>) {
        super(injector, validators, asyncValidators);
        this.selectionDiffer = differs.find({}).create();
    }

    identifier = `email-${identifier++}`;

    initializeOption(list, parent = null) {
        for (let option of list) {
            option.parent                         = parent;
            option.state                          = option.state || 'off';
            this.selection[option[this.selectBy]] = this.value.indexOf(option[this.selectBy]) > -1;

            if (this.hasChildren(option)) {
                this.initializeOption(option.children, option);
            }
        }

    }

    ngOnInit() {
        this.isInitialized = false;
        super.ngOnInit();
        this.searcher = new NestedSearcher(this.searchBy);
        this.initializeOptions();

    }

    initializeOptions() {
        setTimeout(() => {
            let copy = JSON.parse(JSON.stringify(this.options));
            this.initializeOption(copy);
            this.initializedOptions = copy;
            this.isInitialized      = true;
        });
    }

    ngDoCheck() {
        const changes = this.selectionDiffer.diff(this.selection);
        if (changes && this.isInitialized) {
            this.value = Object.keys(this.selection).filter(key => this.selection[key]);
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
                child.state = top.state !== 'indeterminate' ? top.state : child.state;
                return this.updateChildrenOfItem(child, checkedStatus, top);
            });
    }
}

let identifier = 0;
