import {Component, Input, ViewEncapsulation} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Observable} from "rxjs/Rx";

@Component({
    selector     : 'submit-button',
    template     : `
        <div class="form-group">
            <button class="btn btn-primary" type="button" (click)="submit()" [id]="identifier">
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

    protected identifier = `submit-${identifier++}`;

    submit() {
        this.validateAllFormFields(this.formGroup);
        console.log('form is valid', this.formGroup.valid);
    }

    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {  //{2}
            const control = formGroup.get(field);             //{3}
            if (control instanceof FormControl) {             //{4}
                console.log(control);
                control.markAsTouched();
            } else if (control instanceof FormGroup) {        //{5}
                this.validateAllFormFields(control);            //{6}
            }
        });
    }

}

let identifier = 0;
