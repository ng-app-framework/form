import {Component, NgModule, ViewEncapsulation} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {NgFormModule} from "../lib/NgFormModule";
import {DemoComponent} from "./Component/DemoComponent";
import {CheckBoxDemoComponent} from "./Component/CheckBoxDemoComponent";
import {EmailDemoComponent} from "./Component/EmailDemoComponent";
import {DatePickerDemoComponent} from "./Component/DatePickerDemoComponent";
import {OptionListDemoComponent} from "./Component/OptionListDemoComponent";
import {NestedListDemoComponent} from "./Component/NestedListDemoComponent";
import {NestedOptionListDemoComponent} from "./Component/NestedOptionListDemoComponent";

@NgModule({
    declarations: [
        DemoComponent,
        CheckBoxDemoComponent,
        DatePickerDemoComponent,
        OptionListDemoComponent,
        NestedListDemoComponent,
        NestedOptionListDemoComponent,
        EmailDemoComponent
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
