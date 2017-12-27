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
export class RequiredCheckBoxValidator extends RequiredValidator {
    private _isRequired: boolean;
    private _change: () => void;

    @Input()
    get required(): boolean /*| string*/ {
        return this._isRequired;
    }

    set required(value: boolean) {
        this._isRequired = value != null && value !== false && `${value}` !== 'false';
        if (this._change) this._change();
    }

    validate(c: AbstractControl): { [key: string]: any } {
        return this.required && !c.value ? {required: true} : null;
    }

    registerOnValidatorChange(fn: () => void): void {
        this._change = fn;
    }

}
