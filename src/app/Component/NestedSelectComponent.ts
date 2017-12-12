import {ViewEncapsulation, Component, Input, EventEmitter, Output, OnDestroy, OnInit} from '@angular/core';
import {NestedSearcher} from "../Service/Impl/NestedSearcher";
import {NestedSelector} from "../Service/Impl/NestedSelector";
import {CheckBox} from "../Service/Impl/CheckBox";
import {Async, UnsubscribeAll, Value} from "@ng-app-framework/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";

@Component({
    selector     : '.nested-select',
    template     : `
        <div class="form-group">
            <input type="text" [(ngModel)]="searcher.search" class="form-control" placeholder="Search..."/>
        </div>
        <div class="form-group">
            <div class="form-control expandable" *ngIf="hasPopulated">
                <div class="nested-list" [element]="{children: initializedOptions}"
                     [onCollapseAll]="onCollapseAll"
                     [onExpandAll]="onExpandAll" [shouldDisplay$]="shouldDisplay$">
                    <ng-template let-item>
                        <div [class.bold]="shouldBold(item)"
                             [class.child-selected]="selector.areAnyChildrenSelected$(item) | async"
                             class="form-check">
                            <div *ngIf="item.checkbox" class="check-box three-state" [value]="item.id"
                                 [labelLocation]="'before'"
                                 [service]="item.checkbox"
                                 [name]="item.name"
                                 [canBeIndeterminate]="hasChildren(item)">
                                <span class="before">{{item.name}}</span>
                            </div>
                        </div>
                    </ng-template>
                </div>
            </div>
        </div>
    `,
    styleUrls    : ['./assets/nested-select.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NestedSelectComponent implements OnInit, OnDestroy {


    onCollapseAll               = new EventEmitter<any>();
    onExpandAll                 = new EventEmitter<any>();
    @Input() selected: any[]    = [];
    @Input() options: any[]     = [];
    @Input() selectBy: string   = 'id';
    @Input() searchBy: string[] = ['name'];

    @Output() selectedChange = new EventEmitter<any>();

    initializedOptions = [];

    selector: NestedSelector;
    searcher: NestedSearcher;

    onDestroy$ = new EventEmitter<any>();
    onInit$    = new EventEmitter<any>();

    hasPopulated = false;


    private createNewCheckBoxForItem(item) {
        item.checkbox              = new CheckBox();
        item.checkbox.isThreeState = true;
        let stopListening          = UnsubscribeAll.merge(this.onDestroy$);
        item.checkbox.onOn.takeUntil(stopListening).subscribe(() => {
            this.selector.selectAllOfItem$(item).subscribe()
        });
        item.checkbox.onOff.takeUntil(stopListening).subscribe(() => {
            this.selector.deselectAllOfItem$(item).subscribe()
        });
        item.checkbox.onIndeterminate.takeUntil(stopListening).subscribe(() => {
            this.selector.deselect(item)
        });
        return item.checkbox;
    }

    populateCheckBoxes(list, parent = null) {
        for (let option of list) {
            if (parent) {
                option.parent = parent;
            }
            if (!Value.isInstanceOf(option.checkbox, CheckBox)) {
                option.checkbox = this.createNewCheckBoxForItem(option);
            }
            if (Value.hasArrayElements(option.children)) {
                this.populateCheckBoxes(option.children, option);
            }
        }

    }

    ngOnInit() {
        this.initializedOptions = this.options;
        this.hasPopulated       = false;
        this.populateCheckBoxes(this.initializedOptions);
        this.hasPopulated = true;
        this.selector     = new NestedSelector(this.initializedOptions, this.selected, this.selectBy);
        this.searcher     = new NestedSearcher(this.searchBy);

        this.selector.onSelect.merge(this.selector.onDeselect)
            .takeUntil(UnsubscribeAll.merge(this.onDestroy$))
            .subscribe(value => {
                this.selectedChange.emit(this.selected)
            });
        this.onInit$.emit();
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
    }

    shouldBold(item) {
        return this.searcher.isTermLongEnough() && this.searcher.doesItemMatchSearch(item);
    }

    hasChildren(item) {
        return Value.hasArrayElements(item.children);
    }

    shouldDisplay$ = (item): Observable<boolean> => {
        return Async.ifThenElse$(this.searcher.doesItemMatchSearch$(item),
            (result) => !result,
            () => this.searcher.doesParentMatchSearch$(item),
            () => Async.getObservableForValue$(true)
        );
    };
}
