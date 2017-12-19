import {Directive, forwardRef, Input} from "@angular/core";
import {AbstractControl, NG_VALIDATORS, RequiredValidator, Validators} from "@angular/forms";

@Directive({
    selector :
        'check-box[ngModel][required]',
    providers: [{
        provide    : NG_VALIDATORS,
        useExisting: forwardRef(() => RequiredCheckBoxValidator),
        multi      : true
    }],
    host     : {'[attr.required]': 'required ? "" : null'}
})
export class RequiredCheckBoxValidator {
    private _required: boolean;
    private _onChange: () => void;

    @Input()
    get required(): boolean /*| string*/ {
        return this._required;
    }

    set required(value: boolean) {
        this._required = value != null && value !== false && `${value}` !== 'false';
        if (this._onChange) this._onChange();
    }

    validate(c: AbstractControl): { [key: string]: any } {
        return this.required && !c.value ? {required: true} : null;
    }

    registerOnValidatorChange(fn: () => void): void {
        this._onChange = fn;
    }

}
