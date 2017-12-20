import {Component, ViewEncapsulation} from "@angular/core";
import * as stringify from "json-stringify-safe";

@Component({
    selector     : '.radio-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/radio-demo.html'
})
export class RadioDemoComponent {

    model = {
        name    : 'testRadio',
        required: false,
        horizontal: false,
        value   : '',
        options : [
            {
                label: 'Option 1',
                value: 'option-1'
            },
            {
                label: 'Option 2',
                value: 'option-2'
            },
            {
                label: 'Option 3',
                value: 'option-3'
            }
        ]
    };

    markup = `
<form #testForm="ngForm" novalidate>
    <check-box [(ngModel)]="model.required"
               name="required"
               label="Is Required"
               labelPlacement="after"></check-box>
    <div class="card card-body bg-light">
        <radio-group [name]="model.name"
                     label="Test Radio Group"
                     [options]="model.options"
                     [required]="model.required"
                     [(ngModel)]="model.value">
        </radio-group>
    </div>
    <submit-button label="Submit" [formGroup]="testForm.form"></submit-button>
</form>
    `;

    getObject(object) {
        return JSON.parse(stringify(object));
    }
}


