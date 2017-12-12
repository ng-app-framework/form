import {MultiSelector} from "../Impl/MultiSelector";
import {SingleSelector} from "../Impl/SingleSelector";

export class SelectorFactory {

    static create(isMultiple: boolean, list: any[], selected: any[], selectBy ?: string) {
        return new (isMultiple ? MultiSelector : SingleSelector)(list, selected, selectBy);
    }
}
