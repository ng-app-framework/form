import {Component, ViewEncapsulation} from "@angular/core";
import * as stringify from 'json-stringify-safe';

@Component({
    selector     : '.email-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/email-demo.html'
})
export class EmailDemoComponent {

    model = {
        id         : 'emailField',
        name       : 'emailField',
        match      : '',
        required   : false,
        placeholder: 'Example Email Field',
        value      : ''
    };

    markup = `
<form #testForm="ngForm">
    <check-box [(ngModel)]="model.required" name="required" label="Is Required" labelPlacement="after"></check-box>
    <div class="card card-body bg-light">
        <email
                [name]="model.name"
                label="Email Address"
                [(ngModel)]="model.value"
                [required]="model.required"
                [placeholder]="model.placeholder"></email>
        <email name="confirmEmail" label="Confirm Email Address"
               [(ngModel)]="model.match"
               [matchValue]="{value:model.value,label:'Email Address'}"
               [required]="true"
               placeholder="Confirm Email"></email>
    </div>
    <submit-button label="Submit" [formGroup]="testForm.form"></submit-button>
</form>
    `;

    getObject(object) {
        return JSON.parse(stringify(object));
    }


}
