import {Component, EventEmitter, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.option-list-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/option-list-demo.html'
})
export class OptionListDemoComponent {
    model = {
        isMultiple: false,
        required: false,
        selected  : null,
        options   : [
            {id: 1, text: 'Label 1'},
            {id: 2, text: 'Label 2'},
            {id: 3, text: 'Label 3'}
        ]
    };

    markup = `
<option-list
    [options]="model.options"
    [selectBy]="'id'"
    [(selected)]="model.selected"
    [isMultiple]="model.isMultiple"
    [isNested]="false"
    [placeholder]="'Select One...'"></option-list>
    `;

    constructor() {
    }


}
