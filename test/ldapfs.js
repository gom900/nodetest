var assert = require("assert");
var ldapfs = require("../ldapfs.js");
describe("file_check", function() {
    it("should return jsmith object ", function() {
        var flist = [];
        flist.push({
            name: 'jsmith',
            userpassword: 'testtest',
            test: 'xx'
        });
        assert.deepEqual(flist, ldapfs.getlist());
    });
});
