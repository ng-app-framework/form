import {Directive, forwardRef} from "@angular/core";
import {EmailValidator, NG_VALIDATORS, Validators} from "@angular/forms";

@Directive({
    selector :
        'email',
    providers: [{
        provide    : NG_VALIDATORS,
        useExisting: forwardRef(() => OptionalEmailValidator),
        multi      : true
    }]
})
export class OptionalEmailValidator extends EmailValidator {
    validate(control) {
        return control.value && control.value.length > 0 ? Validators.email(control) : null;
    }
}
