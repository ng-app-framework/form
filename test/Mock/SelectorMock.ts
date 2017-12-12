import {SelectorInterface} from "../../src/app/Service/Interface/SelectorInterface";

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
