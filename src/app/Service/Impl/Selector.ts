import {EventEmitter} from "@angular/core";
import {SelectorInterface} from "../Interface/SelectorInterface";
import {OnChange, ValueInterpreter} from "@ng-app-framework/core";
import 'rxjs/Rx';

export abstract class Selector implements SelectorInterface {

    onSelect: EventEmitter<any>   = new EventEmitter<any>();
    onDeselect: EventEmitter<any> = new EventEmitter<any>();

    interpreter: ValueInterpreter;

    @OnChange selected: any                     = null;
              selectedChange: EventEmitter<any> = new EventEmitter<any>();

    constructor(public options: any[], selected: any, public selectBy: string = 'id') {
        this.interpreter = new ValueInterpreter(selectBy);
        this.selected    = selected;
    }

    toggle(option) {
        if (!this.isSelected(option)) {
            this.select(option);
            return;
        }
        this.deselect(option);
    }

    triggerSelectEvent(option) {
        this.selected = this.interpreter.getValueOfObject(option);
        this.onSelect.emit(option);
    }

    triggerDeselectEvent(option) {
        this.selected = null;
        this.onDeselect.emit(option);
    }

    abstract isSelected(option: any);

    select(option) {
        if (!this.isSelected(option)) {
            this.triggerSelectEvent(option);
        }
    }

    deselect(option) {
        if (this.isSelected(option)) {
            this.triggerDeselectEvent(option);
        }
    }

    getSelected() {
        return this.selected;
    }
}
