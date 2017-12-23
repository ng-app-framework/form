import {Injectable} from "@angular/core";
import {ValidatorResults, ValidatorResult} from "../validate";

@Injectable()
export class ValidatorMessenger {

    getPlural(value) {
        return value !== 1 ? 's' : '';
    }

    messages: { [key: string]: (result: ValidatorResult, key: string, label?: string) => string } = {
        required : (result: { [key: string]: any } | boolean, key: string, label: string = '') => {
            return `${label} is required`;
        },
        pattern  : (result: ValidatorResult, key: string, label: string = '') => {
            return `Invalid format for ${label}`;
        },
        email    : (result: ValidatorResult, key: string, label: string = '') => {
            return `${label} must be a valid email address.`;
        },
        minlength: (result: ValidatorResult, key: string, label: string = '') => {
            let plural = this.getPlural(result['requiredLength']);
            return `${label} must be at least ${result['requiredLength']} character${plural}`;
        },
        maxlength: (result: ValidatorResult, key: string, label: string = '') => {
            let plural = this.getPlural(result['requiredLength']);
            return `${label} must be at most ${result['requiredLength']} character${plural}`;
        }
    };

    getMessageForError(result: ValidatorResults, key: string, label: string = '') {
        label = label.length > 0 ? label : key;
        if (typeof this.messages[key] === 'function') {
            return this.messages[key](result[key], key, label);
        }
        switch (typeof result[key]) {
            case 'string':
                return <string> result[key];
            default:
                return `Validation failed: ${label}`;
        }
    }
}
