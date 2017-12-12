import {ViewEncapsulation, Component, Input, EventEmitter, Output, ViewChild, OnInit, OnDestroy} from '@angular/core';
import {CheckBox} from "../Service/Impl/CheckBox";
import {Subscription} from "rxjs/Subscription";
import {UnsubscribeAll} from "@ng-app-framework/core";
import 'rxjs/Rx';


@Component({
    selector     : '.check-box:not(.three-state)',
    template     : `
        <div class="row" (click)="onClick()">
            <div class="col-xs-12 col-12">
                <span class="checkbox-label" [hidden]="labelLocation !== 'before'">
                    <ng-content select=".before"></ng-content>
                </span>
                <span class="checkbox-container">
                    <input #checkbox type="checkbox" [attr.name]="name || null" [attr.id]="id || null"
                           [attr.value]="value"
                           [disabled]="disabled" readonly [attr.checked]="service.isChecked || null" tabindex="-1"/>
                </span>
                <span class="checkbox-label" [hidden]="labelLocation !== 'after'">
                    <ng-content select=".after"></ng-content>
                </span>
            </div>
        </div>
    `,
    styleUrls    : ['./assets/check-box.scss'],
    encapsulation: ViewEncapsulation.None
})
export class CheckBoxComponent implements OnInit, OnDestroy {

    @Input() checked: boolean = false;
    @Input() state            = 'off';

    @Input() value: any            = true;
    @Input() name: string          = '';
    @Input() id: string            = '';
    @Input() labelLocation: string = 'after';
    @Input() disabled: boolean     = false;

    @Output() onOn          = new EventEmitter<any>();
    @Output() onOff         = new EventEmitter<any>();
    @Output() checkedChange = new EventEmitter<any>();
    @Output() stateChange   = new EventEmitter<any>();

    @Input() service: CheckBox = new CheckBox();

    @ViewChild("checkbox") checkbox;

    isCheckedSub: Subscription;
    statusSub: Subscription;
    onOnSub: Subscription;
    onOffSub: Subscription;

    onDestroy$ = new EventEmitter<any>();

    ngOnInit() {
        this.service.listen();
        this.service.isChecked = this.checked;
        this.service.status    = this.state;
        let stopListening      = UnsubscribeAll.merge(this.onDestroy$);
        this.isCheckedSub      = this.service.isCheckedChange.takeUntil(stopListening).subscribe((value) => this.checkedChange.emit(value));
        this.statusSub         = this.service.statusChange.takeUntil(stopListening).subscribe((value) => this.stateChange.emit(value));
        this.onOnSub           = this.service.onOn.takeUntil(stopListening).subscribe((value) => this.onOn.emit(value));
        this.onOffSub          = this.service.onOff.takeUntil(stopListening).subscribe((value) => this.onOff.emit(value));
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
        this.service.onDestroy$.emit();
    }

    onClick() {
        if (!this.disabled) {
            this.service.isChecked = !this.service.isChecked;
        }
    }
}
