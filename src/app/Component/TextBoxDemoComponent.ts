import {Component, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.text-box-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/text-box-demo.html'
})
export class TextBoxDemoComponent {

    model = {
        name       : 'textBoxField',
        icon       : '',
        shouldMatch: false,
        match: '',
        required   : false,
        placeholder: 'Example Text Field',
        value      : ''
    };

    markup = `
<form #testForm="ngForm">
    <check-box [(ngModel)]="model.required" name="required" label="Is Required" labelPlacement="after"></check-box>
    <check-box name="shouldMatch" label="Should Match Matching Field" [(ngModel)]="model.shouldMatch" labelPlacement="after"></check-box>
    <text-box name="icon" label="Icon" [(ngModel)]="model.icon"></text-box>
    <text-box name="match" label="Matching Field" [(ngModel)]="model.match"></text-box>
    <div class="well">
        <text-box
                [name]="model.name"
                label="Test Text Field"
                [(ngModel)]="model.value"
                [matchValue]="model.shouldMatch ? {value:model.match,label:'Matching Field'} : null"
                [icon]="model.icon"
                [required]="model.required"
                [placeholder]="model.placeholder"></text-box>
    </div>
    <submit-button label="Submit" [formGroup]="testForm.form"></submit-button>
</form>
    `;


}
