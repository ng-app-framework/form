import {Selector} from "./Selector";
import {Async} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";

export class SingleSelector extends Selector {
    isSelected(option) {
        return this.doesValueMatchOption(option, this.selected);
    }

    select(option) {
        this.deselectPreviousSelection$(this.selected).subscribe();
        super.select(option);
    }

    deselectPreviousSelection$(value): Observable<any> {
        return Async.forEach$(this.options, (option) => {
            if (this.doesValueMatchOption(option, value)) {
                this.onDeselect.emit(option);
            }
        });
    }

    doesValueMatchOption(option, value) {
        return value === this.interpreter.getValueOfObject(option);
    }
}
