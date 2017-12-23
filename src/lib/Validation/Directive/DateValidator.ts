import {Directive, forwardRef, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, RequiredValidator, Validators} from "@angular/forms";
import {ValidatorMessenger} from "../Service/ValidatorMessenger";
import {ValidatorResults} from "../validate";

@Directive({
    selector :
        '[date]',
    providers: [{
        provide    : NG_VALIDATORS,
        useExisting: forwardRef(() => DateValidator),
        multi      : true
    }]
})
export class DateValidator {


    constructor(messenger: ValidatorMessenger) {
        if (!messenger.messages.hasOwnProperty('date')) {
            messenger.messages['date'] = (result: ValidatorResults, key: string, label: string = '') => {
                return `${label} be a valid date`;
            };
        }
    }

    validate(c: AbstractControl): { [key: string]: boolean } | null {
        if (c.pristine) {
            return null;
        }
        if ((c.value !== undefined && c.value !== '' && c.value != null)) {
            let {month, day, year} = this.getDateValues(c);
            if (isNaN(month) || isNaN(day) || isNaN(year)) {
                return {'date': true};
            }
            return this.checkDateLimits(month, day, year);
        }
        return null;
    }

    getDateValues(c: AbstractControl) {
        let month = null;
        let day   = null;
        let year  = null;
        if (c.value.indexOf('/') > -1) {
            let res = c.value.split("/");
            if (res.length > 1) {
                month = res[0];
                day   = res[1];
                year  = res[2];
            }
        }
        else {
            if (c.value.length == 8) {
                month = c.value.substring(0, 2);
                day   = c.value.substring(2, 4);
                year  = c.value.substring(4, 8);
            }
        }
        return {month, day, year};
    }

    checkDateLimits(month, day, year) {
        month = Number(month);
        day   = Number(day);
        year  = Number(year);
        if (month < 1 || month > 12) { // check month range
            return {'date': true};
        }
        if (day < 1 || day > 31) {
            return {'date': true};
        }
        if ((month === 4 || month === 6 || month === 9 || month === 11) && day === 31) {
            return {'date': true};
        }
        if (month == 2) { // check for february 29th
            let isleap = (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
            if (day > 29 || (day === 29 && !isleap)) {
                return {'date': true};
            }
        }
    }

}
