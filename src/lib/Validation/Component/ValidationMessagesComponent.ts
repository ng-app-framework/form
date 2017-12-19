import {Component, Input} from '@angular/core';


@Component({
    selector: 'validation-messages',
    template: `
        <div class="alert alert-danger" *ngIf="messages.length > 0">
            <ul>
                <li *ngFor="let message of messages">{{message}}</li>
            </ul>
        </div>
    `
})
export class ValidationMessagesComponent {
    @Input() messages: Array<string>;
}
