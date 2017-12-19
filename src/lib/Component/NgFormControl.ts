import {EventEmitter, Injector, OnDestroy, OnInit, Output} from "@angular/core";
import {NgControl, NgModel} from "@angular/forms";
import {AsyncValidatorArray, ValidatorArray} from "../Validation/validate";
import {ElementBase} from "../ValueAccessor/ElementBase";

export abstract class NgFormControl<T> extends ElementBase<T> implements OnInit {
    abstract name: string;
    abstract label: string;
    abstract disabled: boolean;
    abstract required: boolean;

    model: NgModel;
    requiredChange: EventEmitter<boolean> = new EventEmitter<boolean>();
    disabledChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(public injector: Injector,
                validators: ValidatorArray,
                asyncValidators: AsyncValidatorArray,) {
        super(validators, asyncValidators);
    }

    ngOnInit() {
        super.ngOnInit();
        this.initializeNgModel();
    }

    initializeNgModel() {
        try {
            this.model = this.injector.get(NgControl);
        } catch (e) {
            throw new Error("NgModel was not provided");
        }
    }
}
