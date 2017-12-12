import {Component, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : 'app',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/demo.html',
    styleUrls    : ['../../../public/demo-styles.scss']
})
export class DemoComponent {

    models = {
        select            : {
            options: [
                {id: 1, text: 'Label 1'},
                {id: 2, text: 'Label 2'},
                {id: 3, text: 'Label 3'}
            ]
        },
        nestedList        : {
            name    : 'test parent',
            children: [
                {
                    name    : 'test child',
                    children: [
                        {
                            name: 'test child of child'
                        }
                    ]
                }
            ]
        },
        nestedSelect      : {
            selected: [],
            options : [
                {
                    id      : 1,
                    name    : 'test parent',
                    children: [
                        {
                            id      : 2,
                            name    : 'test child',
                            children: [
                                {
                                    id  : 3,
                                    name: 'test child of child'
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    constructor() {

    }

}
