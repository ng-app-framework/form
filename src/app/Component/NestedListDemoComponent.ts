import {Component, EventEmitter, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.nested-list-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/nested-list-demo.html'
})
export class NestedListDemoComponent {
    model = {
        nestedListNode: {
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
        }
    };

    markup = `
    <nested-list
        [element]="model.nestedListNode">
        <ng-template let-item>
            {{item.name}}
        </ng-template>
    </nested-list>
    `;



}
