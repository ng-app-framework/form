import {ViewEncapsulation, Component, Input, Output, EventEmitter} from '@angular/core';
import {SiteConfig} from "@ng-app-framework/core";
import 'rxjs/Rx';


@Component({
    selector     : '.date-picker',
    template     : `
        <div class="input-group">
            <input type="text" bsDatepicker #dp="bsDatepicker"
                   [bsConfig]="{containerClass: theme,weeks:false}"
                   [(ngModel)]="value" class="form-control" [attr.name]="name" [attr.id]="id" [minDate]="minDate"
                   [maxDate]="maxDate" [disabled]="disabled"/>
            <span class="input-group-btn">
                <button class="btn btn-outline-primary" type="button" (click)="!disabled ? dp.toggle() : null"
                        [disabled]="disabled">
                    <span class="fa fa-calendar"></span>
                </button>
            </span>
        </div>
    `,
    styleUrls    : ['./assets/date-picker.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent {
    @Input()
    public get value(): string {
        return this._value;
    }

    public set value(value: string) {
        this._value = value;
        this.valueChange.emit(value);
    }

    private _value: string;
    @Input() name: string;
    @Input() id: string;

    @Input() theme: string = '';

    @Input() minDate: Date;
    @Input() maxDate: Date;
    @Input() disabled: boolean = false;

    @Output() valueChange = new EventEmitter<any>();

    ngOnInit() {
        this.theme = this.theme.length > 0 ? this.theme : SiteConfig.theme;
    }

}
