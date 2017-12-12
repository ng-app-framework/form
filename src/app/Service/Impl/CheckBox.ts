import {EventEmitter} from "@angular/core";
import {OnChange, UnsubscribeAll} from "@ng-app-framework/core";
import 'rxjs/Rx';

export class CheckBox {

    readonly on            = 'on';
    readonly off           = 'off';
    readonly indeterminate = 'indeterminate';

    isThreeState = false;

    @OnChange isChecked: boolean                     = false;
    @OnChange status: string                         = 'off';
              isCheckedChange: EventEmitter<boolean> = new EventEmitter<boolean>();
              statusChange: EventEmitter<string>     = new EventEmitter<string>();
              onOn: EventEmitter<string>             = new EventEmitter<string>();
              onOff: EventEmitter<string>            = new EventEmitter<string>();
              onIndeterminate: EventEmitter<string>  = new EventEmitter<string>();


    onDestroy$ = new EventEmitter<any>();

    listen() {
        this.isCheckedChange.takeUntil(UnsubscribeAll.merge(this.onDestroy$)).subscribe(() => {
            this.setStatusByIsChecked();
            this.sendOnStatusEvent();
        });
        this.statusChange.takeUntil(UnsubscribeAll.merge(this.onDestroy$)).subscribe(() => {
            this.setCheckedByStatus();
            this.sendOnStatusEvent();
        })
    }

    private setStatusByIsChecked() {
        let newStatus = this.isChecked ? this.on : this.off;
        if (this.isThreeState) {
            newStatus = this.isChecked ? this.on : this.status;
        }
        if (newStatus !== this.status) {
            this.status = newStatus;
        }
    }

    private setCheckedByStatus() {
        this.isChecked = this.status === this.on;
    }

    private sendOnStatusEvent() {
        if (this.status === this.on) {
            this.onOn.emit(this.status);
        }
        if (this.status === this.off) {
            this.onOff.emit(this.status);
        }
        if (this.status === this.indeterminate) {
            this.onIndeterminate.emit(this.status);
        }
    }
}
