import {Component, EventEmitter, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.nested-check-box-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/nested-check-box-demo.html'
})
export class NestedCheckBoxDemoComponent {
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

    markup = `
<form #testForm="ngForm">
    <check-box [(ngModel)]="model.required"
               name="required"
               label="Is Required"
               labelPlacement="after"></check-box>
    <div class="card card-body bg-light">
        <nested-check-box
                [options]="model.options"
                [(ngModel)]="model.selected"
                [required]="model.required"
                name="testList"
                label="Test Nested Options"
                [selectBy]="'name'"
                [searchBy]="['name']">
        </nested-check-box>
    </div>
    <submit-button label="Submit" [formGroup]="testForm.form"></submit-button>
</form>
    `;

}
