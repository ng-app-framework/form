import {Component, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.checkbox-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/checkbox-demo.html'
})
export class CheckBoxDemoComponent {

    model = {
        state  : 'off',
        checked: false
    };

    markup = `
<div class="check-box" 
    [disabled]="isDisabled"
    (onOn)="callWhenStateChangesToOn()"
    (onOff)="callWhenStateChangesToOff()"
    [labelLocation]="'after'" 
    [(checked)]="model.checked"
    [(state)]="model.state">
    <span class="after">Check Box</span>
</div>
    `;

    constructor() {

    }

}
