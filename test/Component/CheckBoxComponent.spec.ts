import {TestBed} from "@angular/core/testing";
import {NO_ERRORS_SCHEMA} from "@angular/core";
import {CheckBoxComponent} from "../../src/lib/Component/FormControl/CheckBoxComponent";
import {CommonModule} from "@angular/common";

describe('Module: Form', () => {
    describe('Component: CheckBoxComponent', () => {
        let wrapper                      = null;
        let component: CheckBoxComponent = null;

        beforeEach(() => {
            TestBed
                .configureTestingModule({
                    imports     : [CommonModule],
                    declarations: [CheckBoxComponent],
                    // Tells the compiler not to error on unknown elements and attributes
                    schemas     : [NO_ERRORS_SCHEMA]
                });
            TestBed.compileComponents();

            wrapper = TestBed.createComponent(CheckBoxComponent);
            wrapper.detectChanges();
            component = wrapper.componentInstance;
        });

        describe('Upon Creation', () => {

            let checkbox  = null;
            let container = null;
            beforeEach(() => {
                let element = wrapper.nativeElement;
                container   = element.querySelector('.row');
                updateCheckbox();
            });

            function updateCheckbox() {
                wrapper.detectChanges();
                checkbox = container.querySelector('input[type="checkbox"]');
            }

            function click() {
                container.click();
                updateCheckbox();
            }

            it('should maintain a checkbox', () => {
                updateCheckbox();
                expect(checkbox).toBeTruthy()
            });

            function assertCheckedAfterClicked(shouldBeChecked) {
                click();
                if (shouldBeChecked) {
                    expect(checkbox.getAttribute('checked')).toBeTruthy();
                    return;
                }
                expect(checkbox.getAttribute('checked')).not.toBeTruthy();
            }

            describe('Before Clicking the Box', () => {
                it('should not be checked', () => {
                    expect(checkbox.getAttribute('checked')).not.toBeTruthy();
                });
            });
            describe('After Clicking the Box', () => {
                describe('Clicking once', () => {
                    it('should be checked', () => {
                        assertCheckedAfterClicked(true);
                    });
                });
                describe('Clicking twice', () => {
                    it('should be not checked', () => {
                        assertCheckedAfterClicked(true);
                        assertCheckedAfterClicked(false);
                    });
                });
                describe('Clicking When Disabled', () => {
                    beforeEach(() => {
                        component.disabled = true;
                        wrapper.detectChanges();
                    });
                    it('should not be checked', () => {
                        assertCheckedAfterClicked(false);
                        assertCheckedAfterClicked(false);
                    })
                })
            });
        });
    });
});
