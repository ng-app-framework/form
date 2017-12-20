import {Component, ViewEncapsulation} from "@angular/core";
import * as stringify from 'json-stringify-safe';

@Component({
    selector     : '.checkbox-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/checkbox-demo.html'
})
export class CheckBoxDemoComponent {

    model = {
        name        : 'testCheckBox',
        isThreeState: false,
        required    : false,
        state       : 'off',
        checked     : false,
        ngModel     : null,
        value       : 'CHECK BOX IS CHECKED!'
    };

    markup = `
<form #testForm="ngForm" novalidate>
    <check-box [(ngModel)]="model.required"
               name="required"
               label="Is Required"
               labelPlacement="after"></check-box>
    <check-box [(ngModel)]="model.isThreeState"
               name="threeState"
               label="Is Three State"
               labelPlacement="after"></check-box>
    <div class="card card-body bg-light">
        <check-box
                [name]="model.name"
                [required]="model.required"
                [threeState]="model.isThreeState"
                [checkedValue]="model.value"
                [(ngModel)]="model.ngModel"
                [(state)]="model.state"
                label="Test Check Box">
        </check-box>
    </div>
    <submit-button label="Submit" [formGroup]="testForm.form"></submit-button>
</form>
    `;
}


