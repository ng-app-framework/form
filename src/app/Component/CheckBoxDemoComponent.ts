import {Component, ViewEncapsulation} from "@angular/core";
import * as stringify from 'json-stringify-safe';

@Component({
    selector     : '.checkbox-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/checkbox-demo.html'
})
export class CheckBoxDemoComponent {

    model = {
        name   : 'testCheckBox',
        isThreeState: false,
        required: false,
        state  : 'off',
        checked: false,
        ngModel: null,
        value: 'CHECK BOX IS CHECKED!'
    };

    markup = `
<form #testForm="ngForm" novalidate>
    <check-box [(ngModel)]="model.required" name="required" label="Is Required">
    </check-box>
    <check-box [(ngModel)]="model.isThreeState" name="threeState" label="Is Three State">
    </check-box>
    <check-box
               [name]="model.name"
               [required]="model.required"
               [threeState]="model.isThreeState"
               [checkedValue]="model.value"
               [(ngModel)]="model.ngModel"
               [(state)]="model.state"
               label="Check Box">
    </check-box>
    <button class="btn btn-primary" type="submit" [disabled]="!testForm.form.valid">
        Submit
    </button>
</form>
    `;

    constructor() {

    }


    getNonCircularObject(obj) {
        return JSON.parse(stringify(obj));
    }

}
