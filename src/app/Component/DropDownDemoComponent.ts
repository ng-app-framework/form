import {Component, EventEmitter, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.drop-down-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/drop-down-demo.html'
})
export class DropDownDemoComponent {
    model = {
        isMultiple: false,
        icon      : '',
        required  : false,
        selected  : null,
        options   : [
            {id: 1, text: 'Label 1'},
            {id: 2, text: 'Label 2'},
            {id: 3, text: 'Label 3'}
        ]
    };

    markup = `
<form #testForm="ngForm" novalidate>
    <check-box [(ngModel)]="model.required" name="required" label="Is Required" labelPlacement="after"></check-box>
    <check-box [(ngModel)]="model.isMultiple" name="isMultiple" label="Is Multiple" labelPlacement="after"></check-box>
    <div class="card card-body bg-light">
        <drop-down
                [options]="model.options"
                [selectBy]="'id'"
                class="full-width"
                name="testOptionList"
                label="Test Option List"
                [required]="model.required"
                [(ngModel)]="model.selected"
                [isMultiple]="model.isMultiple"
                [placeholder]="'Select One...'">
            <ng-template let-item>
                {{item.id}} - {{ item.text }}
            </ng-template>
        </drop-down>
    </div>
    <submit-button label="Submit" [formGroup]="testForm.form"></submit-button>
</form>
    `;


}
