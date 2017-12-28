import {Component, Input} from '@angular/core';
import {ValidatorMessenger} from "../Service/ValidatorMessenger";


@Component({
    selector: 'validation-messages',
    template: `
        <div class="alert alert-danger" *ngIf="errors !== null">
            <ul>
                <li *ngFor="let key of getKeys()">{{getMessage(key)}}</li>
            </ul>
        </div>
    `
})
export class ValidationMessagesComponent {
    @Input() errors: { [key: string]: boolean };
    @Input() label: string = '';

    constructor(public messenger: ValidatorMessenger) {

    }

    getKeys() {
        return Object.keys(this.errors)
    }

    getMessage(key) {
        return this.messenger.getMessageForError(this.errors, key, this.label);
    }
}
