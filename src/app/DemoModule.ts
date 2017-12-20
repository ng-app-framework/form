import {Component, NgModule, ViewEncapsulation} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {NgFormModule} from "../lib/NgFormModule";
import {DemoComponent} from "./Component/DemoComponent";
import {CheckBoxDemoComponent} from "./Component/CheckBoxDemoComponent";
import {EmailDemoComponent} from "./Component/EmailDemoComponent";
import {DatePickerDemoComponent} from "./Component/DatePickerDemoComponent";
import {DropDownDemoComponent} from "./Component/DropDownDemoComponent";
import {NestedListDemoComponent} from "./Component/NestedListDemoComponent";
import {NestedCheckBoxDemoComponent} from "./Component/NestedCheckBoxDemoComponent";
import {RadioDemoComponent} from "./Component/RadioDemoComponent";
import {TextBoxDemoComponent} from "./Component/TextBoxDemoComponent";

@NgModule({
    declarations: [
        DemoComponent,
        CheckBoxDemoComponent,
        DatePickerDemoComponent,
        DropDownDemoComponent,
        NestedListDemoComponent,
        NestedCheckBoxDemoComponent,
        EmailDemoComponent,
        TextBoxDemoComponent,
        RadioDemoComponent
    ],
    imports     : [
        BrowserModule,
        CommonModule,
        NgFormModule
    ],
    exports     : [DemoComponent],
    providers   : [],
    bootstrap   : [DemoComponent]

})
export class DemoModule {

}
