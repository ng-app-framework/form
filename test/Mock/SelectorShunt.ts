import {Selector} from "../../src/lib/Service/Impl/Selector";

export class SelectorShunt extends Selector {

    calledSelect   = false;
    calledDeselect = false;

    constructor(options: any[], selected: any, selectBy?: string) {
        super(options, selected, selectBy);
        this.interpreter = <any> {
            getValueOfObject: (option) => {
                return option[this.selectBy];
            }
        }
    }


    triggerSelectEvent(option) {
        super.triggerSelectEvent(option);
        this.calledSelect = true;
    }

    triggerDeselectEvent(option) {
        super.triggerDeselectEvent(option);
        this.calledDeselect = true;
    }

    isSelected(option: any) {
        return this.selected === this.interpreter.getValueOfObject(option);
    }
}
