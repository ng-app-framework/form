import {NgModule} from '@angular/core';
import {DatePickerComponent} from "./Component/FormControl/DatePickerComponent";
import {CheckBoxComponent} from "./Component/FormControl/CheckBoxComponent";
import {NestedListComponent} from "./Component/FormControl/NestedListComponent";
import {OptionListComponent} from "./Component/FormControl/OptionListComponent";
import {NestedOptionListComponent} from "./Component/FormControl/NestedOptionListComponent";
import {BsDatepickerModule} from "ngx-bootstrap";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgSelectModule} from "@ng-select/ng-select";
import {EmailComponent} from './Component/FormControl/EmailComponent';
import {ValidationMessagesComponent} from "./Validation/Component/ValidationMessagesComponent";
import {RequiredCheckBoxValidator} from "./Validation/Directive/RequiredCheckBoxValidator";
import {OptionalEmailValidator} from './Validation/Directive/OptionalEmailValidator';
import {SubmitButtonComponent} from 'src/lib/Component/SubmitButtonComponent';

@NgModule({
    declarations: [
        DatePickerComponent,
        CheckBoxComponent,
        NestedListComponent,
        NestedOptionListComponent,
        OptionListComponent,
        EmailComponent,
        ValidationMessagesComponent,
        RequiredCheckBoxValidator,
        OptionalEmailValidator,
        SubmitButtonComponent
    ],
    imports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NgSelectModule,
        BsDatepickerModule.forRoot()
    ],
    exports     : [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NestedListComponent,
        NestedOptionListComponent,
        DatePickerComponent,
        CheckBoxComponent,
        OptionListComponent,
        EmailComponent,
        SubmitButtonComponent
    ],
    providers   : [
        RequiredCheckBoxValidator,
        OptionalEmailValidator
    ]
})
export class NgFormModule {
}
