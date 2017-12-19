import {SingleSelector} from "../../src/lib/Service/Impl/SingleSelector";

describe('Module: Form', () => {
    describe('Class: SingleSelector', () => {
        describe('On New Instance', () => {
            it('should be a new instance of SingleSelector', () => {
                let service = new SingleSelector([], null);
                expect(service instanceof SingleSelector).toBeTruthy();
            });
        });

        describe('After Instantiation', () => {
            let service: SingleSelector;

            beforeEach(() => {
                service          = new SingleSelector([], null);
                service.selected = 3;
                service.options  = [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                    {id: 4},
                    {id: 5}
                ];
            });
            describe('Method: Is Selected', () => {
                let assertIsSelected    = function (id, name) {
                    expect(service.isSelected({id, name})).toBeTruthy(`${id} ${name} should be selected`);
                };
                let assertIsNotSelected = function (id, name) {
                    expect(service.isSelected({id, name})).toBeFalsy(`${id} ${name} should not be selected`);
                };
                it('should make sure that the selection value is equal to the value of the provided option', () => {
                    assertIsSelected(3, 'bob');
                    assertIsNotSelected(2, 'bob');
                    assertIsSelected(3, 'stephen');
                    assertIsNotSelected(2, 'stephen');
                });
            });
            describe('Method: Deselect all', () => {
                it('should asynchronously iterate and deselect each option', (done) => {
                    let numDeselected = 0;
                    let deselected    = [];
                    let subscription  = service.onDeselect.subscribe((option) => {
                        numDeselected++;
                        deselected.push(option.id);
                    });
                    service.deselectPreviousSelection$(3).subscribe({
                        complete: () => {
                            expect(deselected).toEqual([3]);
                            expect(numDeselected).toEqual(1);
                            subscription.unsubscribe();
                            done();
                        }
                    })
                });
            });
            describe('Method: Select', () => {
                it('should fire the deselection event if a value is selected before selecting a value', (done) => {

                    service.onDeselect.first().subscribe((option) => {
                        expect(option.id).toEqual(3);
                        done();
                    });
                    service.select({id: 2});
                })
            });
        });
    });
});
