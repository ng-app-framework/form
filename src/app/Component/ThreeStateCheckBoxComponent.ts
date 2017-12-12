import {ViewEncapsulation, Component, Input, EventEmitter, Output, ViewChild, ElementRef} from '@angular/core';
import {CheckBoxComponent} from "./CheckBoxComponent";
import {CheckBox} from "../Service/Impl/CheckBox";
import {UnsubscribeAll} from "@ng-app-framework/core";
import 'rxjs/Rx';


@Component({
    selector     : '.check-box.three-state',
    template     : `
        <div class="row" (click)="onClick()">
            <div class="col-12 col-xs-12">
                <span class="checkbox-label" [hidden]="labelLocation !== 'before'">
                    <ng-content select=".before"></ng-content>
                </span>
                <span class="checkbox-container text-right">
                    <input #checkbox type="checkbox" [attr.name]="name || null" [attr.id]="id || null"
                           [attr.value]="value"
                           [attr.indeterminate]="(service.status === service.indeterminate) || null"
                           [disabled]="disabled" readonly
                           [checked]="service.isChecked" tabindex="-1"/>
                </span>

                <span class="checkbox-label" [hidden]="labelLocation !== 'after'">
                    <ng-content class=".after"></ng-content>
                </span>
            </div>
        </div>
    `,
    styleUrls    : ['./assets/check-box.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ThreeStateCheckBoxComponent extends CheckBoxComponent {

    @Input() checked: boolean = false;
    @Input() state            = 'off';

    @Input() value: any            = true;
    @Input() name: string          = '';
    @Input() id: string            = '';
    @Input() canBeIndeterminate    = true;
    @Input() labelLocation: string = 'after';
    @Input() disabled: boolean     = false;

    @Output() onOn          = new EventEmitter<any>();
    @Output() onOff         = new EventEmitter<any>();
    @Output() checkedChange = new EventEmitter<any>();
    @Output() stateChange   = new EventEmitter<any>();


    @Input() service: CheckBox = new CheckBox();

    @ViewChild("checkbox") checkbox: ElementRef;

    ngOnInit() {
        super.ngOnInit();
        this.service.isThreeState = true;
        this.service.statusChange.takeUntil(UnsubscribeAll.merge(this.onDestroy$)).subscribe((value) => {
            this.checkbox.nativeElement.indeterminate = value === 'indeterminate';
        });
    }

    onClick() {
        if (!this.disabled) {
            if (this.service.status === this.service.off) {
                return this.service.status = this.service.on;
            }
            if (this.service.status === this.service.on && (this.canBeIndeterminate)) {
                return this.service.status = this.service.indeterminate;
            }
            if (this.service.status === this.service.indeterminate || (this.service.status === this.service.on && !this.canBeIndeterminate)) {
                return this.service.status = this.service.off;
            }
        }
    }
}
