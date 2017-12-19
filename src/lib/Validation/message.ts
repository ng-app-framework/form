import {ValidationResult} from "./validate";

export const message = (validator: ValidationResult, key: string): string => {
    function getPlural(value) {
        return value !== 1 ? 's' : '';
    }

    let plural = '';
    switch (key) {
        case 'required':
            return 'Field Is Required';
        case 'pattern':
            return 'Invalid Format';
        case 'minlength':
            plural = getPlural(validator.minlength['requiredLength']);
            return `Minimum Length: ${validator.minlength['requiredLength']} character${plural}`;
        case 'maxlength':
            plural = getPlural(validator.maxlength['requiredLength']);
            return `Maximum Length: ${validator.maxlength['requiredLength']} character${plural}`;
        case 'email':
            return 'Invalid Email Address Format';
    }


    switch (typeof validator[key]) {
        case 'string':
            return <string> validator[key];
        default:
            return `Validation failed: ${key}`;
    }
};
