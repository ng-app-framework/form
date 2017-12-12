import {Component, ViewEncapsulation} from "@angular/core";

@Component({
    selector     : '.date-picker-demo',
    encapsulation: ViewEncapsulation.None,
    templateUrl  : 'assets/date-picker-demo.html'
})
export class DatePickerDemoComponent {

    model = {
        value  : new Date(),
        minDate: new Date(),
        maxDate: new Date()
    };

    markup = `
<div class="date-picker"
    [id]="id"
    [name]="name"
    [theme]="'some-class-name'"
    [disabled]="false"
    [(value)]="models.datePicker.value"
    [minDate]="models.datePicker.minDate"
    [maxDate]="models.datePicker.maxDate"></div>
    `;

    constructor() {
        let minDate = new Date();
        minDate.setMonth(minDate.getMonth() - 1);
        let maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 1);
        this.model.minDate = minDate;
        this.model.maxDate = maxDate;
    }

}
