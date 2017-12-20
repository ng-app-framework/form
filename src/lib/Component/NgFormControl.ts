import {EventEmitter, Injector, OnDestroy, OnInit} from "@angular/core";
import {FormControl, NgControl, NgModel} from "@angular/forms";
import {Value} from "@ng-app-framework/core";
import {Observable} from "rxjs/Rx";
import {ValidatorMessenger} from "../Validation/Service/ValdiatorMessenger";
import {AsyncValidatorArray, validate, ValidatorResults, ValidatorArray} from "../Validation/validate";
import {BaseValueAccessor} from "../ValueAccessor/BaseValueAccessor";

export abstract class NgFormControl<T> extends BaseValueAccessor<T> implements OnInit, OnDestroy {

    model: NgModel;
    parentFormControl: FormControl;

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

    messenger: ValidatorMessenger;

    isValueProvided = false;

    constructor(public injector: Injector,
                protected validators: ValidatorArray           = [],
                protected asyncValidators: AsyncValidatorArray = []) {
        super();
        this.messenger = this.injector.get(ValidatorMessenger);
    }


    private validateOnChange() {
        this.valueChange.takeUntil(this.onDestroy$)
            .subscribe(() => {
                this.updateIsValueProvided();
                this.triggerValidate();
            });
    }

    private validateOnInterval() {
        Observable.interval(800)
            .takeUntil(this.onDestroy$)
            .subscribe(() => this.triggerValidate());
    }

    private updateValidityFlags(errors) {
        this.invalid = errors !== null && typeof errors !== 'undefined';
        if (!this.invalid) {
            this.failures = [];
        }
    }

    private validate(): Observable<ValidatorResults> {
        return <any>validate((this.validators || []).concat(this.additionalValidators || []), this.asyncValidators || [])(this.model.control);
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
    }

    ngOnInit() {
        try {
            this.shouldValidate = this.shouldValidate.toString() === 'true' || this.shouldValidate === true;
            this.model          = this.injector.get(NgControl);
            this.updateIsValueProvided();
            this.validateOnChange();
            this.validateOnInterval();
            this.initialized = true;
        } catch (e) {
            throw new Error("[(ngModel)] was not provided");
        }
    }

    public updateIsValueProvided() {
        this.isValueProvided = typeof this.value !== 'undefined' && this.value !== null;
        if (Array.isArray(this.value) || typeof this.value === 'string') {
            this.isValueProvided = this.value.length > 0;
        }
    }

    triggerValidate() {
        if (this.shouldValidate) {
            this.validate()
                .distinctUntilChanged()
                .subscribe(errors => {
                    this.updateValidityFlags(errors);
                    if (this.invalid) {
                        this.model.control.setErrors(errors);
                        this.failures = Object.keys(errors).map(key => this.messenger.getMessageForError(errors, key, this.label));
                    }
                });
        }
    }

    get control() {
        return this.parentFormControl ? this.parentFormControl : this.model.control;
    }

    get invalid$() {
        return this.invalidChange;
    }

    get failures$() {
        return this.failuresChange;
    }
}
