import {EventEmitter} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {CheckBox} from "../../src/app/Service/Impl/CheckBox";

describe('Module: Form', () => {
    describe('Class: CheckBox', () => {
        describe('On New Instance', () => {
            it('should be a new instance of CheckBox', () => {
                let service = new CheckBox();
                expect(service instanceof CheckBox).toBeTruthy();
            });
        });
        describe('After Instantiation', () => {
            let service: CheckBox;
            beforeEach(() => {
                service = new CheckBox();
                service.listen();
            });
            afterEach(() => {
                service.onDestroy$.emit();
            });
            describe('Has Properties', () => {
                it('should contain the checked value', () => {
                    expect(service['isChecked'] === undefined).toBeFalsy();
                    expect(typeof service.isChecked === 'boolean').toBeTruthy();
                });
                it('should contain a status value (on, off)', () => {
                    expect(service['status'] === undefined).toBeFalsy();
                    expect(typeof service.status === 'string').toBeTruthy();
                });
                it('should contain constants for status values', () => {
                    expect(service['on'] === undefined).toBeFalsy();
                    expect(service['off'] === undefined).toBeFalsy();
                    expect(service['indeterminate'] === undefined).toBeFalsy();
                });
                it('should have event emitters for checked and status to send change events', () => {
                    expect(service['statusChange'] === undefined).toBeFalsy('statusChange is undefined');
                    expect(service['statusChange'] instanceof EventEmitter).toBeTruthy('statusChange is not an EventEmitter');

                    expect(service['isCheckedChange'] === undefined).toBeFalsy('checkedChange is undefined');
                    expect(service['isCheckedChange'] instanceof EventEmitter).toBeTruthy('checkedChange is not an EventEmitter');
                });
            });
            describe('When Changing the Checked Value', () => {
                it('should emit a change event', (done) => {
                    service.isCheckedChange.first().subscribe((value) => {
                        expect(value).toBeTruthy();
                        done();
                    });
                    service.isChecked = true;
                });

                describe('Alter Status', () => {
                    it('is not three state', () => {
                        service.isChecked = true;
                        expect(service.status).toEqual(service.on);
                        service.isChecked = false;
                        expect(service.status).toEqual(service.off);
                    });
                    it('is three state and is checked', () => {
                        service.isThreeState = true;
                        service.isChecked    = true;
                        expect(service.status).toEqual(service.on);
                    })
                });
                describe('Do Not Alter Status', () => {

                    it('is three state and is not checked', () => {
                        service.isChecked    = true;
                        service.isThreeState = true;
                        service.status       = service.indeterminate;
                        service.isChecked    = false;
                        expect(service.status).toEqual(service.indeterminate);
                    });
                });
            });
            describe('When Changing the Status Value', () => {
                it('should emit a change event', (done) => {
                    service.statusChange.first().subscribe((value) => {
                        expect(value).toEqual(service.on);
                        done();
                    });
                    service.status = 'on';
                });
                it('should only alter the checked value if the status change is on or off', () => {

                    service.status = 'on';
                    expect(service.isChecked).toEqual(true);
                    service.status = 'indeterminate';
                    expect(service.isChecked).toEqual(false);
                    service.status = 'off';
                    expect(service.isChecked).toEqual(false);
                });
                it('should emit an event for each status', (done) => {
                    let called = {
                        on           : false,
                        off          : false,
                        indeterminate: false
                    };
                    Observable.merge(
                        service.onOn.first().map(() => called.on = true),
                        service.onOff.first().map(() => called.off = true),
                        service.onIndeterminate.first().map(() => called.indeterminate = true))
                        .subscribe({
                            complete: () => {
                                expect(called.on).toBeTruthy();
                                expect(called.off).toBeTruthy();
                                expect(called.indeterminate).toBeTruthy();
                                done();
                            }
                        });
                    service.status = service.on;
                    service.status = service.off;
                    service.status = service.indeterminate;
                });
            });
        });
    });
});
