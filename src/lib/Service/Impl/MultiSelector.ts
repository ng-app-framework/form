import {Selector} from "./Selector";
import {Async} from "@ng-app-framework/core";
import 'rxjs/Rx';
import {Observable} from "rxjs/Rx";

export class MultiSelector extends Selector {

    constructor(public options: any[], public selected: any, public selectBy: string = 'id') {
        super(options, selected, selectBy);
    }

    triggerSelectEvent(option) {
        this.selected.push(this.interpreter.getValueOfObject(option));
        this.onSelect.emit(option);
    }

    getIndexOf(option) {
        return this.selected.indexOf(this.interpreter.getValueOfObject(option));
    }

    triggerDeselectEvent(option) {
        this.selected.splice(this.getIndexOf(option), 1);
        this.onDeselect.emit(option);
    }

    isSelected(option): boolean {
        return this.getIndexOf(option) > -1;
    }

    selectAll$(): Observable<any> {
        return Async.forEach$(this.options, (option) => this.select(option));
    }

    deselectAll$(): Observable<any>  {
        return Async.forEach$(this.options, (option) => this.deselect(option));
    }
}
