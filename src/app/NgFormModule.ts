import {NgModule} from '@angular/core';
import {DatePickerComponent} from "./Component/DatePickerComponent";
import {CheckBoxComponent} from "./Component/CheckBoxComponent";
import {NestedListComponent} from "./Component/NestedListComponent";
import {ThreeStateCheckBoxComponent} from "./Component/ThreeStateCheckBoxComponent";
import {SelectComponent} from "./Component/SelectComponent";
import {NestedSelectComponent} from "./Component/NestedSelectComponent";
import {BsDatepickerModule} from "ngx-bootstrap";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserModule} from "@angular/platform-browser/";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgSelectModule} from "@ng-select/ng-select";

@NgModule({
    declarations: [
        DatePickerComponent,
        CheckBoxComponent,
        NestedListComponent,
        NestedSelectComponent,
        ThreeStateCheckBoxComponent,
        SelectComponent
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
        NestedListComponent,
        NestedSelectComponent,
        DatePickerComponent,
        CheckBoxComponent,
        ThreeStateCheckBoxComponent,
        SelectComponent
    ],
    providers   : []
})
export class NgFormModule {
}
