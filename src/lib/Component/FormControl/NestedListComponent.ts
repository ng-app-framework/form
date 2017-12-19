import {
    ViewEncapsulation, Component, Input, ContentChild, TemplateRef, EventEmitter, OnInit, OnDestroy
} from '@angular/core';
import {UnsubscribeAll, Value} from "@ng-app-framework/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";

@Component({
    selector     : 'nested-list',
    template     : `
        <div class="parent-node" [class.has-children]="!isCollapsed() && hasChildren()"
             [hidden]="!(shouldDisplay$(element) | async)">
            <ng-container *ngTemplateOutlet="template;context:{$implicit: element}"></ng-container>
            <span *ngIf="hasChildren()" class="fa" [class.fa-plus]="isCollapsed()" [class.fa-minus]="!isCollapsed()"
                  (click)="toggle()"></span>
            <div class="parent-node-end"></div>
        </div>
        <div class="children-list" *ngIf="hasChildren()" [hidden]="!(shouldDisplay$(element) | async) || isCollapsed()">
            <ng-container *ngFor="let child of element.children">
                <nested-list [element]="child" [template]="template" [initialCollapse]="initialCollapse"
                     [onCollapseAll]="onCollapseAll" [onExpandAll]="onExpandAll" [shouldDisplay$]="shouldDisplay$">

                </nested-list>
            </ng-container>
            <div class="list-end"></div>
        </div>
    `,
    styleUrls    : ['./assets/nested-list.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NestedListComponent implements OnInit, OnDestroy {

    @Input() element: { [key: string]: any, children: any[] };
    @Input() @ContentChild(TemplateRef) template;

    @Input() collapsed       = false;
    @Input() initialCollapse = false;

    @Input() onCollapseAll = new EventEmitter<any>();
    @Input() onExpandAll   = new EventEmitter<any>();


    @Input() shouldDisplay$ = (element) => Observable.from([true]);

    onDestroy$ = new EventEmitter<any>();

    ngOnInit() {
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
        return this.element && Value.hasArrayElements(this.element.children);
    }

    isCollapsed() {
        return this.collapsed;
    }

    toggle() {
        this.collapsed = !this.collapsed;
    }


}
