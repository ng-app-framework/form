import {ViewEncapsulation, Component, Input, Output, EventEmitter, OnInit, OnDestroy} from '@angular/core';
import {OnChange, Value} from "@ng-app-framework/core";

@Component({
    selector     : '.select',
    template     : `
        <ng-container *ngIf="areOptionsProvided() && isInitialized">
            <div *ngIf="isNested" class="nested-select" [options]="options"
                 [selected]="selected" (selectedChange)="onChange($event)"></div>
            <ng-container *ngIf="!isNested">
                <ng-select
                        [items]="options"
                        bindValue="id"
                        bindLabel="text"
                        [multiple]="isMultiple"
                        [placeholder]="placeholder"
                        [(ngModel)]="selected"
                ></ng-select>
            </ng-container>
        </ng-container>
        <ng-container *ngIf="!areOptionsProvided()">
            <div class="alert alert-notice">
                There are no options available.
            </div>
        </ng-container>
    `,
    styleUrls    : ['./assets/ng2-select.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SelectComponent implements OnInit, OnDestroy {

    @Input()
    public get isMultiple(): boolean {
        return this._isMultiple;
    }

    public set isMultiple(value: boolean) {
        this._isMultiple = value;
        if (this.isInitialized) {
            setTimeout(() => {
                this.onMultipleChange(value);
            });
        }
    }

    @OnChange @Input() selected: any                         = null;
    @Input() options: { text: string, [key: string]: any }[] = [];
    @Input() selectBy: string                                = 'id';

    @Output() selectedChange = new EventEmitter<any>();

    private _isMultiple  = false;
    @Input() isNested    = false;
    @Input() placeholder = 'Select ...';

    onDestroy$ = new EventEmitter<any>();

    isInitialized = false;

    ngOnInit() {
        this.isInitialized       = true;
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
        this.isInitialized = false;
    }

    onMultipleChange(value) {
        if (value ) {
            this.selected = this.selected ? [this.selected] : [];
            this.selectedChange.emit(this.selected);
            return;
        }
        this.selected = this.selected[0] || null;
        this.selectedChange.emit(this.selected);
    }

    areOptionsProvided() {
        return Value.hasArrayElements(this.options);
    }
}
