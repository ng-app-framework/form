import {NestedSelector} from "../../src/app/Service/Impl/NestedSelector";
import {Observable} from "rxjs/Rx";
import {CheckBox} from "../../src/app/Service/Impl/CheckBox";

describe('Module: Form', () => {
    describe('Class: NestedSelector', () => {
        describe('On New Instance', () => {
            it('should be a new instance of NestedSelector', () => {
                let service = new NestedSelector([], []);
                expect(service instanceof NestedSelector).toBeTruthy();
            });
        });
        describe('After Instantiation', () => {
            let service: NestedSelector;

            beforeEach(() => {
                service = new NestedSelector([], []);
            });

            describe('Method: Are Any Children Selected', () => {
                it('should return false if a children property does not exist', (done) => {
                    service.areAnyChildrenSelected$({}).subscribe((value) => {
                        expect(value).toBeFalsy();
                        done();
                    });
                });
                it('should return false if no children are provided', (done) => {
                    service.areAnyChildrenSelected$({children: []}).subscribe((value) => {
                        expect(value).toBeFalsy();
                        done();
                    });
                });

                function assertChildrenAreOrNotSelected(expectedResult: boolean, done) {
                    service.isItemOrAnyChildrenSelected$ = (item) => {
                        return Observable.from([expectedResult]);
                    };
                    service.areAnyChildrenSelected$({children: [{}]}).subscribe((value) => {
                        expect(value).toEqual(expectedResult);
                        done();
                    });
                }

                it('should return false if children are not selected', (done) => {
                    assertChildrenAreOrNotSelected(false, done);
                });

                it('should return true if children are selected', (done) => {
                    assertChildrenAreOrNotSelected(true, done);
                });
            });

            describe('Method: Is Item or Any Children Selected', () => {

                function setUpMethods(isSelected, areChildrenSelected) {
                    service.isSelected              = (item) => isSelected;
                    service.areAnyChildrenSelected$ = (item) => Observable.from([areChildrenSelected]);
                }

                it('should return true if the item is selected', (done) => {
                    setUpMethods(true, false);
                    service.isItemOrAnyChildrenSelected$({}).subscribe((value) => {
                        expect(value).toBeTruthy();
                        done();
                    });
                });
                it('should return true if the item is not selected but children are selected', (done) => {
                    setUpMethods(false, true);
                    service.isItemOrAnyChildrenSelected$({}).subscribe((value) => {
                        expect(value).toBeTruthy();
                        done();
                    });
                });
                it('should return false if the item is not selected and children are not selected', (done) => {
                    setUpMethods(false, false);
                    service.isItemOrAnyChildrenSelected$({}).subscribe((value) => {
                        expect(value).toBeFalsy();
                        done();
                    });
                });
            });

            describe('Selection and Deselection', () => {

                let item;
                beforeEach(() => {
                    item = {
                        id      : 1,
                        state   : 'off',
                        children: [
                            {
                                id      : 2,
                                state   : 'off',
                                children: [
                                    {
                                        id   : 3,
                                        state: 'off'
                                    }
                                ]
                            }
                        ]
                    }
                });

                function assertItemAndSelectionMatches(selection, state) {
                    expect(service.selected).toEqual(selection);
                    expect(item.state).toEqual(state);
                    expect(item.children[0].state).toEqual(state);
                    expect(item.children[0].children[0].state).toEqual(state);
                }

                describe('Method: Select All of Item', () => {
                    it('should put each of the items into the selected list and set the state of each', (done) => {
                        service.selectAllOfItem$(item).subscribe({
                            complete: () => {
                                assertItemAndSelectionMatches([1, 2, 3], 'on');
                                done();
                            }
                        })
                    })
                });
                describe('Method: Deselect All of Item', () => {
                    it('should put each of the items into the selected list and set the state of each', (done) => {
                        service.deselectAllOfItem$(item).subscribe({
                            complete: () => {
                                assertItemAndSelectionMatches([], 'off');
                                done();
                            }
                        })
                    })
                });
            });
            describe('Update Checkbox State', () => {
                it('should set the status of a checkbox on the item if it exists', (done) => {
                    let item = {
                        checkbox: new CheckBox()
                    };
                    expect(item.checkbox.status).toEqual('off');
                    service.selectAllOfItem$(item).subscribe({
                        complete: () => {
                            expect(item.checkbox.status).toEqual('on');
                            done();
                        }
                    })
                })
            })
        });
    });
});
