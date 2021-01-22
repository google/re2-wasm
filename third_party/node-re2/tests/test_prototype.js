"use strict";


var unit = require("heya-unit");
var RE2  = require("../../..").RE2;


// tests

unit.add(module, [
	function test_prototype(t) {
		"use strict";

		// Can't easily modify the prototype in TypeScript
		//eval(t.TEST("RE2.prototype.source === '(?:)'"));
		eval(t.TEST("RE2.prototype.flags  === ''"));
		eval(t.TEST("RE2.prototype.global === undefined"));
		eval(t.TEST("RE2.prototype.ignoreCase === undefined"));
		eval(t.TEST("RE2.prototype.multiline  === undefined"));
		eval(t.TEST("RE2.prototype.sticky     === undefined"));
		eval(t.TEST("RE2.prototype.lastIndex  === undefined"));
	}
]);
