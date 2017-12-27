import {EventEmitter, Injector, OnDestroy, OnInit} from "@angular/core";
import {
    FormControl, FormGroup, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NgControl, NgModel,
    RequiredValidator
} from "@angular/forms";
import {Value} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";
import {ValidatorMessenger} from "../Validation/Service/ValidatorMessenger";
import {AsyncValidatorArray, validate, ValidatorResults, ValidatorArray} from "../Validation/validate";
import {BaseValueAccessor} from "../ValueAccessor/BaseValueAccessor";

export abstract class NgFormControl<T> extends BaseValueAccessor<T> implements OnInit, OnDestroy {


    invalid  = false;
    failures = [];

    shouldValidate = true;

    invalidChange  = new EventEmitter<boolean>();
    failuresChange = new EventEmitter<string[]>();

    abstract name: string;
    abstract label: string;
    abstract disabled: boolean;
    abstract required: boolean;

    requiredChange = new EventEmitter<boolean>();
    disabledChange = new EventEmitter<boolean>();
    onDestroy$     = new EventEmitter<any>();

    initialized          = false;
    additionalValidators = [];

    model: NgModel;
    parentFormControl: FormControl;
    parentFormGroup: FormGroup;
    messenger: ValidatorMessenger;
    validators: ValidatorArray           = [];
    asyncValidators: AsyncValidatorArray = [];

    constructor(public injector: Injector) {
        super();
    }

    updateValidityFlags(errors) {
        this.invalid  = errors !== null && typeof errors !== 'undefined';
        this.failures = !this.invalid ? [] : this.failures;
        if (this.invalid) {
            this.model.control.setErrors(errors);
            this.failures = Object.keys(errors).map(key => this.messenger.getMessageForError(errors, key, this.label));
        }
    }

    validate(): Observable<ValidatorResults> {
        return <any>validate((this.validators).concat(this.additionalValidators), this.asyncValidators)(this.model.control);
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
    }

    ngDoCheck() {
        if (this.initialized) {
            if (this.control.touched) {
                this.triggerValidate();
            }
        }
    }

    ngOnInit() {
        try {
            this.shouldValidate  = this.shouldValidate.toString() === 'true' || this.shouldValidate === true;
            this.model           = this.injector.get(NgControl);
            this.messenger       = this.injector.get(ValidatorMessenger);
            this.validators      = <any>this.injector.get(NG_VALIDATORS, []);
            this.asyncValidators = <any>this.injector.get(NG_ASYNC_VALIDATORS, []);
            this.initialized     = true;
            if (this.parentFormGroup) {
                this.parentFormGroup.addControl(this.name, this.control);
            }
        } catch (e) {
            throw new Error("[(ngModel)] was not provided");
        }
    }

    triggerValidate() {
        if (this.shouldValidate && this.initialized) {
            this.validate()
                .distinctUntilChanged()
                .subscribe(errors => {
                    this.updateValidityFlags(errors);
                });
        }
    }

    isInvalid() {
        return this.invalid && this.isTouched();
    }

    isTouched() {
        return this.control.touched;
    }

    get control() {
        return this.parentFormControl ? this.parentFormControl : this.model.control;
    }
}
