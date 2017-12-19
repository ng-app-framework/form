import {MultiSelector} from "../../src/lib/Service/Impl/MultiSelector";
import {UnsubscribeAll} from "@ng-app-framework/core";

describe('Module: Form', () => {
    describe('Class: MultiSelector', () => {
        describe('On New Instance', () => {
            it('should be a new instance of MultiSelector', () => {
                let service = new MultiSelector([], []);
                expect(service instanceof MultiSelector).toBeTruthy();
            });
        });
        describe('After Instantiation', () => {

            let service: MultiSelector;
            let options = [
                {
                    id  : 1,
                    name: 'bob'
                },
                {
                    id  : 2,
                    name: 'james'
                },
                {
                    id  : 3,
                    name: 'joe'
                }
            ];

            beforeEach(() => {
                service = new MultiSelector(options, []);
            });

            describe('Method: Trigger Select Event', () => {
                it('should add a value to the selected list', () => {
                    expect(service.selected.length).toEqual(0);
                    service.select(options[0]);
                    expect(service.selected.length).toEqual(1);
                    expect(service.selected[0]).toEqual(options[0].id);
                });
                it('should emit an event', (done) => {
                    service.onSelect.first().subscribe((selection) => {
                        expect(selection).toEqual(options[0]);
                        done()
                    });
                    service.select(options[0]);
                });
            });
            describe('Method: Trigger Deselect Event', () => {
                beforeEach(() => {
                    service.selected = [1];
                });
                it('should remove a value from the selected list', () => {
                    service.deselect(options[0]);
                    expect(service.selected.length).toEqual(0);
                });
                it('should emit an event', (done) => {
                    service.onDeselect.first().subscribe((selection) => {
                        expect(selection).toEqual(options[0]);
                        done();
                    });
                    service.deselect(options[0]);
                });
            });

            describe('Method: Get Index', () => {
                beforeEach(() => {
                    service.selected = [1];
                });
                it('should be 0 or greater when an option is selected', () => {
                    expect(service.getIndexOf(options[0])).toEqual(0);
                });

                it('should be -1 when an option is not selected', () => {
                    expect(service.getIndexOf(options[1])).toEqual(-1);
                    expect(service.getIndexOf(options[2])).toEqual(-1);
                });
            });
            describe('Method: Is Selected', () => {
                beforeEach(() => {
                    service.selected = [1];
                });
                it('should be true when an option is selected', () => {
                    expect(service.isSelected(options[0])).toBeTruthy();
                });

                it('should be false when an option is not selected', () => {
                    expect(service.isSelected(options[1])).toBeFalsy();
                    expect(service.isSelected(options[2])).toBeFalsy();
                });
            });

            describe('Method: Select All', () => {
                beforeEach(() => {
                    service.selected = [];
                });
                it('should select all options if executed', (done) => {
                    service.selectAll$().subscribe({
                        complete: () => {
                            expect(service.selected.length).toEqual(options.length);
                            done();
                        }
                    });
                });
                it('should not select options that are already selected', (done) => {
                    let optionsSelected = 0;
                    let subscription    = service.onSelect.takeUntil(UnsubscribeAll).subscribe((option) => {
                        optionsSelected++;
                    });
                    service.selected    = [2];
                    service.selectAll$().subscribe({
                        complete: () => {
                            expect(service.selected).toEqual([2, 1, 3]);
                            expect(optionsSelected).toEqual(2);
                            subscription.unsubscribe();
                            done();
                        }
                    });
                });
                it('should select each option individually', (done) => {
                    let optionsSelected = 0;
                    let subscription    = service.onSelect.takeUntil(UnsubscribeAll).subscribe((option) => {
                        optionsSelected++;
                    });
                    service.selectAll$().subscribe({
                        complete: () => {
                            expect(optionsSelected).toEqual(options.length);
                            subscription.unsubscribe();
                            done();
                        }
                    });
                });
            });

            describe('Method: Deselect All', () => {

                beforeEach(() => {
                    service.selected = [1, 2];
                });

                it('should deselect all options if executed', (done) => {
                    service.deselectAll$().subscribe({
                        complete: () => {
                            expect(service.selected.length).toEqual(0);
                            done();
                        }
                    });
                });
                it('should select each option individually', (done) => {
                    let optionsDeselected = 0;
                    service.onDeselect.takeUntil(UnsubscribeAll).subscribe((option) => {
                        optionsDeselected++;
                    });
                    service.deselectAll$().subscribe({
                        complete: () => {
                            expect(optionsDeselected).toEqual(2);
                            done();
                        }
                    });
                });
                it('should not deselect options that are already selected', (done) => {
                    let optionsDeselected = 0;
                    service.onDeselect.takeUntil(UnsubscribeAll).subscribe((option) => {
                        optionsDeselected++;
                    });
                    service.deselectAll$().subscribe({
                        complete: () => {
                            expect(optionsDeselected).toEqual(2);
                            done();
                        }
                    });
                });
            });
        });
    });
});
