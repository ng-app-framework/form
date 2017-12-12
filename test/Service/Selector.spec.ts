import {SelectorShunt} from "../Mock/SelectorShunt";

describe('Module: Form', () => {
    describe('Class: Selector', () => {

        let selector: SelectorShunt;

        beforeEach(() => {
            selector = new SelectorShunt([], null);
        });
        describe('On Instantiation', () => {
            it('should have a selected list', () => {
                expect(selector.selected).toBeNull();
            });
            it('should have an options list', () => {
                expect(Array.isArray(selector.options)).toBeTruthy();
            });
            it('should have a string indicating what we will select by on the options', () => {
                expect(typeof selector.selectBy).toEqual('string');
            });
        });
        describe('After Instantiation', () => {
            beforeEach(() => {
                selector.options = [{
                    id  : 1,
                    name: 'Select Me'
                }];
            });
            describe('Method: Select', () => {

                it('should select an option by a property on the object based on the selectBy value', () => {
                    selector.select(selector.options[0]);
                    expect(selector.selected).toEqual(1);
                });

                it('should not try to select if already selected', () => {
                    selector.calledSelect = false;
                    selector.select(selector.options[0]);
                    expect(selector.calledSelect).toBeTruthy();
                    selector.calledSelect = false;
                    selector.select(selector.options[0]);
                    expect(selector.calledSelect).toBeFalsy();
                });
            });
            describe('Method: Deselect', () => {

                it('should set the selected value to null when deselecting', () => {
                    selector.selected = 1;
                    selector.deselect(selector.options[0]);
                    expect(selector.selected).toBeNull();
                });
                it('should not try to deselect if not selected', () => {
                    selector.calledDeselect = false;
                    selector.selected       = 1;
                    selector.deselect(selector.options[0]);
                    expect(selector.calledDeselect).toBeTruthy();
                    selector.calledDeselect = false;
                    selector.deselect(selector.options[0]);
                    expect(selector.calledDeselect).toBeFalsy();
                });
            });
            describe('Method: Toggle', () => {

                it('should toggle between a selected value and null', () => {
                    expect(selector.selected).toBeNull();
                    selector.toggle(selector.options[0]);
                    selector.toggle(selector.options[0]);
                });
            });
            describe('Method: Get Selected', () => {
                it('should be able to provide the selected list', () => {
                    selector.selected = [1, 2, 3];
                    expect(selector.getSelected()).toEqual([1, 2, 3]);
                });
            });
        });
    });
});
