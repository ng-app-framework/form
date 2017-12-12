import {Component, EventEmitter, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.select-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/select-demo.html'
})
export class SelectDemoComponent {
    model = {
        isMultiple: false,
        selected  : null,
        options   : [
            {id: 1, text: 'Label 1'},
            {id: 2, text: 'Label 2'},
            {id: 3, text: 'Label 3'}
        ]
    };

    markup = `
<div class="select"
    [options]="model.options"
    [selectBy]="'id'"
    [(selected)]="model.selected"
    [isMultiple]="model.isMultiple"
    [isNested]="false"
    [placeholder]="'Select One...'"></div>
    `;

    constructor() {
    }


}
