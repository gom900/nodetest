var assert = require("assert");
var config = require("../config.js");
describe("file_check", function() {
    it("ADMINI_ID  ", function() {
        assert.deepEqual('cn=root', config.ADMIN_ID);
    });
    it("ADMIN_PASSWORD  ", function() {
        assert.deepEqual('dfdasfasfasfsadferefdsrerewr', config.ADMIN_PASSWORD);
    });
    it("SUFFIX  ", function() {
        assert.deepEqual('o=test1,dc=sample,dc=co,dc=jp', config.SUFFIX);
    });
    it("PORT  ", function() {
        assert.deepEqual(1389, config.PORT);
    });
});
