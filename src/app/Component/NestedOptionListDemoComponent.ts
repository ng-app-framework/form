import {Component, EventEmitter, ViewEncapsulation} from "@angular/core";
import * as stringify from 'json-stringify-safe';

@Component({
    selector     : '.nested-option-list-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/nested-option-list-demo.html'
})
export class NestedOptionListDemoComponent {
    model = {
        required: false,
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
    <nested-option-list
         [options]="model.options"
         [selected]="model.selected"
         [selectBy]="'name'"
         [searchBy]="['name']">
    </nested-option-list>
    `;

    constructor() {
    }

    getJSON(obj) {
        return stringify(obj);
    }
    getNonCircularObject(obj) {
        return JSON.parse(stringify(obj));
    }

}
