import {Component, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.three-state-checkbox-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/three-state-checkbox-demo.html'
})
export class ThreeStateCheckBoxDemoComponent {

    model = {
        state  : 'off',
        checked: false
    };

    markup = `
<div class="check-box three-state" 
    [id]="id"
    [name]="name"
    [disabled]="isDisabled"
    [canBeIndeterminate]="true"
    (onOn)="callWhenStateChangesToOn()"
    (onOff)="callWhenStateChangesToOff()"
    [labelLocation]="'after'"
    [(checked)]="model.checked"
    [(state)]="model.state">
    Check Box
</div>
    `;

    constructor() {

    }

}
