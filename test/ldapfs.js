var assert = require("assert");
var ldapfs = require("../ldapfs.js");
describe("file_check", function() {
    ldapfs.init();
    it("should return jsmith object ", function() {
        var flist = [];
        flist.push({
            name: 'jsmith',
            userpassword: 'x',
            test: 'test'
        });
        assert.deepEqual(flist, ldapfs.getlist());
    });
});
