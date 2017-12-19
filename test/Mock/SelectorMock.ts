import {SelectorInterface} from "../../src/lib/Service/Interface/SelectorInterface";

export class SelectorMock implements SelectorInterface {


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
