var matchme = require('matchme'),
    expect = require('chai').expect,
    testdata = require('./helpers/testdata');
    
describe('!= tests', function() {
    it('fred != bob is ok', function() {
        var result = matchme(testdata.fred, 'name != bob');
        
        expect(result).to.be.ok;
    });
    
    it('fred != fred is not ok', function() {
        var result = matchme(testdata.fred, 'name != fred');
        
        expect(result).to.not.be.ok;
    });
});