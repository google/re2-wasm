"use strict";


var unit = require("heya-unit");
var RE2  = require("../../..").RE2;


// tests

unit.add(module, [
	function test_toString(t) {
		"use strict";

		eval(t.TEST("(new RE2('', 'u')).toString() === '/(?:)/u'"));
		eval(t.TEST("(new RE2('a', 'u')).toString() === '/a/u'"));
		eval(t.TEST("(new RE2('b', 'iu')).toString() === '/b/iu'"));
		eval(t.TEST("(new RE2('c', 'gu')).toString() === '/c/gu'"));
		eval(t.TEST("(new RE2('d', 'mu')).toString() === '/d/mu'"));
		eval(t.TEST("(new RE2('\\\\d+', 'giu')) + '' === '/\\\\d+/giu'"));
		eval(t.TEST("(new RE2('\\\\s*', 'gmu')) + '' === '/\\\\s*/gmu'"));
		eval(t.TEST("(new RE2('\\\\S{1,3}', 'igu')) + '' === '/\\\\S{1,3}/giu'"));
		eval(t.TEST("(new RE2('\\\\D{,2}', 'migu')) + '' === '/\\\\D{,2}/gimu'"));
		eval(t.TEST("(new RE2('^a{2,}', 'miu')) + '' === '/^a{2,}/imu'"));
		eval(t.TEST("(new RE2('^a{5}$', 'gimu')) + '' === '/^a{5}$/gimu'"));
		eval(t.TEST("(new RE2('\\\\u{1F603}/', 'iyu')) + '' === '/\\\\u{1F603}\\\\//iuy'"));

		eval(t.TEST("(new RE2('c', 'ug')).toString() === '/c/gu'"));
		eval(t.TEST("(new RE2('d', 'um')).toString() === '/d/mu'"));
	}
]);
