import {SelectorInterface} from "../../src/lib/Service/Interface/SelectorInterface";

export class MultiSelectorMock implements SelectorInterface {

    public triggerSelectEvent(option): any {
        return undefined;
    }

    public getIndexOf(option): number {
        return undefined;
    }

    public triggerDeselectEvent(option): any {
        return undefined;
    }


    toggle(option) {

    }

    select(option) {

    }

    deselect(option) {

    }

    selectAll$() {

    }

    deselectAll$() {
    }

    isSelected(option) {
        return false;
    }

    getSelected() {
        return [];
    }
}
