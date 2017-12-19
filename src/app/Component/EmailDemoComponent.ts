import {Component, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.email-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/email-demo.html'
})
export class EmailDemoComponent {

    model = {
        id         : 'emailField',
        name       : 'emailField',
        required   : false,
        placeholder: 'Example Email Field',
        value      : ''
    };

    markup = `
<form #testForm="ngForm">
    <check-box [(ngModel)]="model.required" name="required" label="Is Required"></check-box>
    <email
            [name]="model.name"
            label="Email Address"
            [(ngModel)]="model.value"
            [required]="model.required"
            [placeholder]="model.placeholder"></email>
    <button class="btn btn-primary" type="button" [disabled]="!testForm.form.valid" (click)="log(testForm.form)">
        Submit
    </button>
</form>
    `;

    constructor() {

    }

    log(form) {
        console.log(form);
    }

}
