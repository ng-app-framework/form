import {Component, NgModule, ViewEncapsulation} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {NgFormModule} from "../NgFormModule";
import {DemoComponent} from "./DemoComponent";
import {CheckBoxDemoComponent} from "./CheckBoxDemoComponent";
import {ThreeStateCheckBoxDemoComponent} from "./ThreeStateCheckBoxDemoComponent";
import {DatePickerDemoComponent} from "./DatePickerDemoComponent";
import {SelectDemoComponent} from "./SelectDemoComponent";
import {NestedListDemoComponent} from "./NestedListDemoComponent";
import {NestedSelectDemoComponent} from "./NestedSelectDemoComponent";

@NgModule({
    declarations: [
        DemoComponent,
        CheckBoxDemoComponent,
        ThreeStateCheckBoxDemoComponent,
        DatePickerDemoComponent,
        SelectDemoComponent,
        NestedListDemoComponent,
        NestedSelectDemoComponent
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
