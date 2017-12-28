import {Component, Input, ViewEncapsulation, Output, EventEmitter, ViewChild, ElementRef} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs/Rx";

@Component({
    selector     : 'submit-button',
    template     : `
        <div [class.form-group]="inFormGroup">
            <button class="btn btn-primary" type="button" (click)="submit()" [id]="identifier" #button>
                <span class="fa fa-{{ icon }}" *ngIf="icon.length > 0 && iconPlacement === 'before'"></span>
                {{label}}
                <span class="fa fa-{{ icon }}" *ngIf="icon.length > 0 && iconPlacement === 'after'"></span>
            </button>
        </div>
    `,
    encapsulation: ViewEncapsulation.None
})
export class SubmitButtonComponent {

    @Input() icon: string          = '';
    @Input() iconPlacement: string = 'before';
    @Input() label: string         = '';

    @Input() formGroup: FormGroup;

    @Output() onSubmit = new EventEmitter<any>();

    protected identifier = `submit-${identifier++}`;

    onDestroy$ = new EventEmitter<any>();

    @ViewChild('button') button: ElementRef;

    @Input() inFormGroup = true;

    ngOnInit() {
        Observable.fromEvent(this.button.nativeElement, 'keypress')
            .takeUntil(this.onDestroy$)
            .subscribe((value: KeyboardEvent) => {
                if (value.key === 'Enter' || value.key === ' ') {
                    return this.submit();
                }
            });
    }

    ngOnDestroy() {
        this.onDestroy$.emit();
    }

    submit() {
        this.validateAllFormFields(this.formGroup);
        if (this.formGroup.valid) {
            this.onSubmit.emit(this.formGroup.value);
        }
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {  //{2}
            const control = formGroup.get(field);             //{3}
            if (control instanceof FormControl) {             //{4}
                control.markAsTouched();
            } else if (control instanceof FormGroup) {        //{5}
                this.validateAllFormFields(control);            //{6}
            }
        });
    }

}

let identifier = 0;
