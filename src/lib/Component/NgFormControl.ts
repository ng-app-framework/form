import {EventEmitter, Injector, OnDestroy, OnInit} from "@angular/core";
import {
    FormControl, FormGroup, NG_ASYNC_VALIDATORS, NG_VALIDATORS, NgControl, NgModel,
    RequiredValidator
} from "@angular/forms";
import {OnChange, Value} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";
import {ValidatorMessenger} from "../Validation/Service/ValidatorMessenger";
import {AsyncValidatorArray, validate, ValidatorResults, ValidatorArray} from "../Validation/validate";
import {BaseValueAccessor} from "../ValueAccessor/BaseValueAccessor";

export abstract class NgFormControl<T> extends BaseValueAccessor<T> implements OnInit, OnDestroy {

    shouldValidate = true;

    abstract name: string;
    abstract label: string;
    abstract disabled: boolean;
    abstract required: boolean;

    requiredChange = new EventEmitter<boolean>();
    disabledChange = new EventEmitter<boolean>();
    onDestroy$     = new EventEmitter<any>();

    @OnChange initialized          = false;
              initializedChange    = new EventEmitter<boolean>();
              additionalValidators = [];

    model: NgModel;
    parentFormControl: FormControl;
    parentFormGroup: FormGroup;
    validators: ValidatorArray = [];

    control: FormControl;

    constructor(public injector: Injector) {
        super();
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
    }

    ngOnInit() {
        try {
            this.validators = <any>this.injector.get(NG_VALIDATORS, []);
            this.model      = this.injector.get(NgControl);
            this.setupControl();
            this.startValidating();
            setTimeout(() => {
                this.initialized = true;
                setTimeout(() => this.onLoad(), 100);
            });
        } catch (e) {
            throw new Error("[(ngModel)] was not provided");
        }
    }

    setupControl() {
        this.control = this.parentFormControl ? this.parentFormControl : this.model.control;
        setTimeout(() => {
            if (this.parentFormGroup) {
                this.parentFormGroup.addControl(this.name, this.control);
            }
        });
    }

    startValidating() {
        this.shouldValidate = this.shouldValidate.toString() === 'true' || this.shouldValidate === true;
        if (this.shouldValidate) {
            this.control.setValidators(<any>this.validators.concat(this.additionalValidators || []));
        }
        this.validateOnInterval();
    }

    validateOnInterval() {
        Observable.interval(1000)
            .takeUntil(this.onDestroy$)
            .subscribe(() => {
                this.validate();
            });
    }

    touch() {
        super.touch();
        if (!this.isTouched()) {
            this.control.markAsTouched();
        }
    }

    validate() {
        if (this.isTouched()) {
            this.control.updateValueAndValidity();
        }
    }

    isInvalid$() {
        return Observable.of(this.invalid && this.isTouched());
    }

    isTouched() {
        return this.control && this.control.touched;
    }

    get failures() {
        return this.control ? this.control.errors : null;
    }

    get failures$() {
        return Observable.of(this.failures);
    }

    get invalid$() {
        return Observable.of(this.invalid);
    }

    get touched$() {
        return Observable.of(this.isTouched());
    }

    get invalid() {
        if (this.failures && !this.control.invalid) {
            setTimeout(() => {
                this.control.setErrors(this.failures);
            });
        }
        return this.control ? this.control.invalid : false;
    }

    protected triggerValidation() {
        this.touch();
        this.validate();
    }

    onLoad() {

    }

}
