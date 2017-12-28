
import {Value} from "@ng-app-framework/core";
import 'rxjs/Rx';

export class Searcher {

    search: string = '';

    constructor(public searchBy: string[] = ['name'], public minLength: number = 3) {

    }

    doesItemMatchSearch(item: any) {
        return this.doesItemStringMatchSearch(item) || this.doItemPropertiesMatchSearch(item);
    }

    doItemPropertiesMatchSearch(item) {
        for (let property of this.searchBy) {
            if (this.doesItemPropertyMatchSearch(item, property)) {
                return true;
            }
        }
        return false;
    }

    doesItemPropertyMatchSearch(item: any, property) {
        if (Value.isScalar(item[property])) {
            return item[property].toLowerCase().indexOf(this.search.toLowerCase()) > -1;
        }
        return false;
    }

    doesItemStringMatchSearch(item: any) {
        return typeof item === 'string' && item.toLowerCase().indexOf(this.search.toLowerCase()) > -1;
    }

    isTermLongEnough() {
        return this.search.length >= this.minLength;
    }
}
