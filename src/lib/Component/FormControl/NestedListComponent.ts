import {
    ViewEncapsulation, Component, Input, ContentChild, TemplateRef, EventEmitter, OnInit, OnDestroy
} from '@angular/core';
import {UnsubscribeAll, Value} from "@ng-app-framework/core";
import {NestedSearcher} from "../../Service/Impl/NestedSearcher";

@Component({
    selector     : 'nested-list',
    template     : `
        <ng-template #defaultTemplate let-item>
            <div class="nested-list-element">{{ item.name ? item.name : item.text}}</div>
        </ng-template>
        <ng-container *ngIf="isTop && searchable">
            <text-box name="nested-search" class="full-width"
                      [(ngModel)]="searcher.search"
                      (ngModelChange)="updateMatches($event)"
                      placeholder="Search ..." icon="search"
                      shouldValidate="false"></text-box>
        </ng-container>
        <div class="nested-list-container {{containerClass}}" [class.top]="isTop">
            <div class="parent-node" [class.has-children]="!isCollapsed() && hasChildren()"
                 [class.show-lines]="showLines"
                 [class.bold]="item['$matches']"
                 (click)="!collapseButton ? toggle() : null"
                 [hidden]="!shouldDisplay(item)">
                <ng-container
                        *ngTemplateOutlet="template ? template : defaultTemplate;context:{$implicit: item}"></ng-container>
                <span *ngIf="hasChildren() && collapseButton" class="fa" [class.fa-plus]="isCollapsed()"
                      [class.fa-minus]="!isCollapsed()"
                      (click)="toggle()"></span>
                <div class="parent-node-end"></div>
            </div>
            <div class="children-list" *ngIf="hasChildren()" [hidden]="!shouldDisplay(item) || isCollapsed()">
                <ng-container *ngFor="let child of item.children">
                    <nested-list [item]="child" [template]="template" [initialCollapse]="initialCollapse"
                                 [searcher]="searcher"
                                 [showLines]="showLines" [collapseButton]="collapseButton"
                                 [onCollapseAll]="onCollapseAll" [onExpandAll]="onExpandAll"
                                 [isTop]="false">

                    </nested-list>
                </ng-container>
                <div class="list-end"></div>
            </div>
        </div>
    `,
    styleUrls    : ['./assets/nested-list.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NestedListComponent implements OnInit, OnDestroy {

    @Input() item: { [key: string]: any, children: any[] };
    @Input() @ContentChild(TemplateRef) template;

    @Input() collapsed       = false;
    @Input() initialCollapse = false;

    @Input() onCollapseAll = new EventEmitter<any>();
    @Input() onExpandAll   = new EventEmitter<any>();

    @Input() searchBy: string[] = ['name'];

    @Input() collapseButton = true;
    @Input() showLines      = true;
    @Input() isTop          = true;

    onDestroy$ = new EventEmitter<any>();

    @Input() searcher: NestedSearcher;
    @Input() searchable: boolean = true;

    @Input() containerClass: string = '';

    ngOnInit() {
        if (!this.searcher) {
            this.searcher = new NestedSearcher(this.searchBy);
        }
        this.initialCollapse = this.collapsed;
        let stopListening    = UnsubscribeAll.merge(this.onDestroy$);
        this.onCollapseAll.takeUntil(stopListening).subscribe(() => {
            this.collapsed = true;
        });
        this.onExpandAll.takeUntil(stopListening).subscribe(() => {
            this.collapsed = false;
        });

    }

    ngOnDestroy() {
        this.onDestroy$.emit();
    }

    hasChildren() {
        return this.item && Value.hasArrayElements(this.item.children);
    }

    isCollapsed() {
        return this.collapsed;
    }

    toggle() {
        this.collapsed = !this.collapsed;
    }


    updateMatches($event) {
        this.searcher.search = $event;
        this.searcher.updateMatches(this.item);
    }

    shouldDisplay(item) {
        return !this.searcher.isTermLongEnough() || item.$matches || item.$parentMatches || item.$childMatches;
    }

}
