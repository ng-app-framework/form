import {EventEmitter, OnDestroy, OnInit} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {message} from "../Validation/message";
import {BaseValueAccessor} from "./BaseValueAccessor";
import {AsyncValidatorArray, validate, ValidationResult, ValidatorArray} from "../Validation/validate";

export abstract class ElementBase<T> extends BaseValueAccessor<T> implements OnInit, OnDestroy {
    protected additionalValidators: ValidatorArray = [];
              onDestroy$: EventEmitter<any>        = new EventEmitter<any>();


    _invalid  = false;
    _failures = [];

    constructor(protected validators: ValidatorArray           = [],
                protected asyncValidators: AsyncValidatorArray = []) {
        super();
    }

    ngOnInit() {
        this.valueChange.takeUntil(this.onDestroy$)
            .subscribe(() => this.triggerValidate());
        Observable.interval(500)
            .takeUntil(this.onDestroy$)
            .subscribe(() => this.triggerValidate());

    }

    triggerValidate() {
        this.validate()
            .do(errors => {
                setTimeout(() => {
                    this.model.control.setErrors(errors);
                })
            })
            .distinctUntilChanged()
            .filter(errors => {
                this._invalid = errors !== null && typeof errors !== 'undefined';
                if (!this._invalid) {
                    this._failures = [];
                }
                return this._invalid;
            })
            .map(errors => {
                return Object.keys(errors).map(key => message(errors, key));
            })
            .subscribe(errors => {
                this._failures = errors;
            });
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
    }


    protected validate(): Observable<ValidationResult> {
        return <any>validate((this.validators || []).concat(this.additionalValidators), this.asyncValidators)(this.model.control);
    }


    protected get invalid(): boolean {
        return this._invalid;
    }


    protected get failures(): string[] {
        return this._failures;
    }
}
