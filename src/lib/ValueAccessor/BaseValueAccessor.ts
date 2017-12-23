import {EventEmitter} from "@angular/core";
import {ControlValueAccessor, NgModel} from "@angular/forms";

export abstract class BaseValueAccessor<T> implements ControlValueAccessor {

    protected abstract model: NgModel;

    protected innerValue: T;

    protected changed: Array<(value: any) => void> = [];
    protected touched: Array<() => void>           = [];

    valueChange = new EventEmitter<T>();

    get value(): T {
        return this.innerValue;
    }

    set value(value: T) {
        this.updateInnerValue(value);
    }

    protected updateInnerValue(value: T) {
        let isDifferent = this.innerValue !== value;
        this.innerValue = value;
        if (isDifferent) {
            this.changed.forEach(f => f(value));
            this.valueChange.emit(value);
        }
    }

    touch() {
        this.touched.forEach(f => f());
    }

    public writeValue(value: T): void {
        this.innerValue = value;
    }

    public registerOnChange(fn: (value: T) => void): void {
        this.changed.push(fn);
    }

    public registerOnTouched(fn: () => void): void {
        this.touched.push(fn);
    }

}
