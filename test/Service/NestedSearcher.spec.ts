import {NestedSearcher} from "../../src/lib/Service/Impl/NestedSearcher";
import {Observable} from "rxjs/Rx";

class NestedSearcherShunt extends NestedSearcher {

    shouldBeFound = true;

    doesItemMatchSearch(item) {
        return this.shouldBeFound;
    }
}

describe('Module: Form', () => {
    describe('Class: NestedSearcher', () => {
        describe('On New Instance', () => {
            it('should be a new instance of NestedSearcher', () => {
                let service = new NestedSearcher();
                expect(service instanceof NestedSearcher).toBeTruthy();
            });
        });
        describe('After Instantiation', () => {
            let service: NestedSearcherShunt;
            beforeEach(() => {
                service = new NestedSearcherShunt();
            });

            describe('Method: Does Item Match Search', () => {
                let shouldBeFoundInChildren = false;
                beforeEach(() => {
                    shouldBeFoundInChildren           = false;
                    service.doAnyChildrenMatchSearch$ = (item) => {
                        return Observable.from([shouldBeFoundInChildren]);
                    };
                });
                describe('Item was found', () => {
                    beforeEach(() => {
                        service.shouldBeFound = true;
                    });

                    it('should return true', (done) => {
                        service.doesItemMatchSearch$({}).subscribe((value) => {
                            expect(value).toBeTruthy();
                            done();
                        });
                    });
                });
                describe('Item was not found', () => {
                    beforeEach(() => {
                        service.shouldBeFound = false;
                    });
                    it('should return true if any children were matched', (done) => {
                        shouldBeFoundInChildren = true;
                        service.doesItemMatchSearch$({children: [{}]}).subscribe((value) => {
                            expect(value).toBeTruthy();
                            done();
                        });
                    });
                    it('should return false if no children were matched', (done) => {
                        shouldBeFoundInChildren = false;
                        service.doesItemMatchSearch$({children: [{}]}).subscribe((value) => {
                            expect(value).toBeFalsy();
                            done();
                        });
                    });
                });
            });

            describe('Method: Does Parent Match Search', () => {
                beforeEach(() => {
                    service.shouldBeFound = false;
                });
                it('should return false if parent does not exist', (done) => {
                    service.doesParentMatchSearch$({}).subscribe((value) => {
                        expect(value).toBeFalsy();
                        done();
                    });
                });
                it('should return false if the parent does not match', (done) => {
                    service.doesParentMatchSearch$({parent: {}}).subscribe((value) => {
                        expect(value).toBeFalsy();
                        done();
                    });
                });
                it('should return true if a parent matches', (done) => {
                    service.shouldBeFound = true;
                    service.doesParentMatchSearch$({parent: {}}).subscribe((value) => {
                        expect(value).toBeTruthy();
                        done();
                    });
                })
            });

            describe('Method: Do Any Children Match Search', () => {
                beforeEach(() => {
                    service.shouldBeFound = false;
                });

                it('regardless of number of children, only one boolean value is returned', (done) => {
                    let numberSent = 0;
                    service.doAnyChildrenMatchSearch$({children: [{}, {}, {}]}).subscribe({
                        next    : (value) => {
                            expect(value).toBeFalsy();
                            numberSent++;
                        },
                        complete: () => {
                            expect(numberSent).toEqual(1);
                            done();
                        }
                    });
                });
                it('should return true if any of the children matched the search', (done) => {
                    service.shouldBeFound = true;
                    service.doAnyChildrenMatchSearch$({children: [{}, {}, {}]}).subscribe((value) => {
                        expect(value).toBeTruthy();
                        done();
                    });
                });
            });

            describe('Method: Are Any Children Found', () => {
                beforeEach(() => {
                    service.shouldBeFound = false;
                });
                it('should return false if there is no children property', (done) => {
                    service.areAnyChildrenFound$({}).subscribe((value) => {
                        expect(value).toBeFalsy();
                        done();
                    })
                });
                it('should return false if there are no children', (done) => {
                    service.areAnyChildrenFound$({children: []}).subscribe((value) => {
                        expect(value).toBeFalsy();
                        done();
                    })
                });
                it('should return true if any children match the search', (done) => {
                    service.shouldBeFound = true;
                    service.areAnyChildrenFound$({children: [{}]}).subscribe((value) => {
                        expect(value).toBeTruthy();
                        done();
                    })
                })
            });
        });
    });
});
