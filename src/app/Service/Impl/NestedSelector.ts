import {MultiSelector} from "./MultiSelector";
import {Observable} from "rxjs/Rx";
import {CheckBox} from "./CheckBox";
import {Async, Value} from "@ng-app-framework/core";
import 'rxjs/Rx';

export class NestedSelector extends MultiSelector {


    constructor(public options: any[], public selected: any, public selectBy: string = 'id') {
        super(options, selected, selectBy);
    }

    areAnyChildrenSelected$(item): Observable<boolean> {
        if (Value.hasArrayElements(item.children)) {
            return this.onEachChildOfItem$(item, child => this.isItemOrAnyChildrenSelected$(child))
                .toArray()
                .map(list => list.indexOf(true) !== -1);
        }
        return Async.getObservableForValue$(false);
    }

    isItemOrAnyChildrenSelected$(item): Observable<boolean> {
        if (this.isSelected(item)) {
            return Async.getObservableForValue$(true);
        }
        return this.areAnyChildrenSelected$(item);
    }

    selectAllOfItem$(item) {
        this.select(item);
        item.state = 'on';
        this.updateCheckboxService(item);
        return this.onEachChildOfItem$(item, child => this.selectAllOfItem$(child));
    }

    deselectAllOfItem$(item) {
        this.deselect(item);
        item.state = 'off';
        this.updateCheckboxService(item);
        return this.onEachChildOfItem$(item, child => this.deselectAllOfItem$(child));
    }

    private onEachChildOfItem$(item, callback$: (child) => Observable<any>) {
        return Async.mapToObservable$(item.children || [], callback$);
    }

    private updateCheckboxService(item) {
        if (Value.isProvided(item.checkbox) && Value.isInstanceOf(item.checkbox, CheckBox)) {
            item.checkbox.status = item.state;
        }
    }
}
