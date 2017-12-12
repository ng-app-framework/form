import {Searcher} from "./Searcher";
import {Observable} from "rxjs/Observable";
import {Async, Value} from "@ng-app-framework/core";
import 'rxjs/Rx';

export class NestedSearcher extends Searcher {


    doesParentMatchSearch$(item) {
        if (item.parent) {
            if (!this.doesItemMatchSearch(item.parent)) {
                return this.doesParentMatchSearch$(item.parent);
            }
            return Async.getObservableForValue$(true);
        }
        return Async.getObservableForValue$(false);
    }


    doesItemMatchSearch$(item): Observable<boolean> {
        if (this.doesItemMatchSearch(item)) {
            return Async.getObservableForValue$(true);
        }
        return this.areAnyChildrenFound$(item);
    }

    areAnyChildrenFound$(item): Observable<boolean> {
        if (Value.hasArrayElements(item.children)) {
            return this.doAnyChildrenMatchSearch$(item);
        }
        return Async.getObservableForValue$(false);
    }

    doAnyChildrenMatchSearch$(item) {
        return Async.mapToObservable$(
            item.children,
            child => this.doesItemMatchSearch$(child)
        )
            .toArray()
            .map(arr => arr.indexOf(true) > -1);
    }
}
