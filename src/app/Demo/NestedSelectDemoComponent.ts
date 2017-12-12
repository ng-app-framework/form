import {Component, EventEmitter, ViewEncapsulation} from "@angular/core";
import * as stringify from 'json-stringify-safe';

@Component({
    selector     : '.nested-select-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/nested-select-demo.html'
})
export class NestedSelectDemoComponent {
    model = {
        options : [
            {
                name    : 'Test Parent',
                children: [
                    {
                        name    : 'Test Child 1',
                        children: [
                            {name: 'Test Child of Child 1'}
                        ]
                    },
                    {
                        name    : 'Test Child 2',
                        children: [
                            {name: 'Test Child of Child 2'}
                        ]
                    }
                ]
            },
            {
                name: 'Test Separate'
            }
        ],
        selected: []
    };

    canBeModified = [
        {
            name    : 'Test Parent',
            children: [
                {
                    name    : 'Test Child 1',
                    children: [
                        {name: 'Test Child of Child 1'}
                    ]
                },
                {
                    name    : 'Test Child 2',
                    children: [
                        {name: 'Test Child of Child 2'}
                    ]
                }
            ]
        },
        {
            name: 'Test Separate'
        }
    ];

    markup = `
    <div class="nested-select"
         [options]="model.options"
         [selected]="model.selected"
         [selectBy]="'name'"
         [searchBy]="['name']">
    </div>
    `;

    constructor() {
    }

    getJSON() {
        return stringify(this.model);
    }

}
