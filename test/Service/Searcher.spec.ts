import {Searcher} from "../../src/lib/Service/Impl/Searcher";

describe('Module: Form', () => {
    describe('Class: Searcher', () => {
        describe('On New Instance', () => {
            it('should be a new instance of Searcher', () => {
                let service = new Searcher();
                expect(service instanceof Searcher).toBeTruthy();
            });
        });
        describe('After Instantiation', () => {
            let service: Searcher;
            beforeEach(() => {
                service = new Searcher();
            });
            describe('Method: Is Term Long Enough', () => {
                it('should be long enough if the number of characters is greater than or equal to the minLength', () => {
                    service.minLength = 3;
                    service.search    = 'no';
                    expect(service.isTermLongEnough()).toBeFalsy();
                    service.search = 'yes';
                    expect(service.isTermLongEnough()).toBeTruthy();
                    service.minLength = 4;
                    expect(service.isTermLongEnough()).toBeFalsy();
                });
            });

            describe('Method: Does Item String Match Search', () => {
                beforeEach(() => {
                    service.search = 'searchString';
                });
                it('should return false if the item is not a string', () => {
                    expect(service.doesItemStringMatchSearch({name: 'searchString'})).toBeFalsy();
                });
                it('should return true if the string contains the search term', () => {
                    expect(service.doesItemStringMatchSearch('searchString was found')).toBeTruthy(1);
                    expect(service.doesItemStringMatchSearch('the searchString was found')).toBeTruthy(2);
                    expect(service.doesItemStringMatchSearch('hear ye hear ye, searchString was found')).toBeTruthy(3);
                });
                it('should return true even if the case does not match', () => {
                    expect(service.doesItemStringMatchSearch('SearchString should be found')).toBeTruthy();
                });
                it('should return false if the string does not contain the search term', () => {
                    expect(service.doesItemStringMatchSearch('search string should not be found')).toBeFalsy();
                })
            });

            describe('Method: Does Item Property Match Search', () => {
                beforeEach(() => {
                    service.search = 'searchString';
                });
                it('should return false if the property on the item is not a scalar value that can be transformed to a string', () => {
                    expect(service.doesItemPropertyMatchSearch(
                        {
                            bob: {
                                test: 'searchString'
                            }
                        },
                        'bob'
                    )).toBeFalsy();
                    expect(service.doesItemPropertyMatchSearch(
                        {
                            bob: ['searchString']
                        },
                        'bob'
                    )).toBeFalsy();
                });
                it('should return false if the property does not match the search', () => {
                    expect(service.doesItemPropertyMatchSearch({test: 'searchStrong'}, 'test')).toBeFalsy();
                });
                it('should return true if the search was found in the property', () => {
                    expect(service.doesItemPropertyMatchSearch({test: 'searchString'}, 'test')).toBeTruthy();
                    expect(service.doesItemPropertyMatchSearch({test: 'SearchString'}, 'test')).toBeTruthy();
                    expect(service.doesItemPropertyMatchSearch({test: 'contains searchString'}, 'test')).toBeTruthy();
                    expect(service.doesItemPropertyMatchSearch({test: 'searchString should be found'}, 'test')).toBeTruthy();

                });
            });

            describe('Method: Do Item Properties Match Search', () => {
                beforeEach(() => {
                    service.searchBy = ['name'];
                });
                it('should return false if scalar value is provided', () => {
                    expect(service.doItemPropertiesMatchSearch('what!?')).toBeFalsy();
                });
                it('should return false if no properties are provided', () => {
                    expect(service.doItemPropertiesMatchSearch({})).toBeFalsy();
                });
                it('should return false if no properties can be searched by', () => {
                    expect(service.doItemPropertiesMatchSearch({whatever: 'searchString'})).toBeFalsy();
                });
                it('should return false if no properties match', () => {
                    service.doesItemPropertyMatchSearch = (item, property) => {
                        return false;
                    };
                    expect(service.doItemPropertiesMatchSearch({name: 'bob'})).toBeFalsy();
                });
                it('should return true if properties match', () => {
                    service.doesItemPropertyMatchSearch = (item, property) => {
                        return true;
                    };
                    expect(service.doItemPropertiesMatchSearch({name: 'doesNotMatter, the method was mocked'})).toBeTruthy();
                })
            });
            describe('Method: Does Item Match Search', () => {
                it('should return true if min length is not reached (we are not searching yet)', () => {
                    service.search = 'ha';
                    expect(service.doesItemMatchSearch({})).toBeTruthy();
                    expect(service.doesItemMatchSearch({name: 'ho'})).toBeTruthy();
                });
                it('should compare the item as a string', () => {
                    service.search = 'searchString';
                    expect(service.doesItemMatchSearch('searchStrong')).toBeFalsy('should have failed with the wrong string');
                    expect(service.doesItemMatchSearch('searchString')).toBeTruthy('should have passed with the right string');
                });
                it('should compare the item properties', () => {
                    service.search = 'searchString';
                    expect(service.doesItemMatchSearch({whatever: 'searchString'})).toBeFalsy();
                    expect(service.doesItemMatchSearch({name: 'searchStrong'})).toBeFalsy();
                    expect(service.doesItemMatchSearch({name: 'searchString'})).toBeTruthy();
                })
            });
        })
    });
});
