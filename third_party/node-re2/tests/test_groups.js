"use strict";


var unit = require("heya-unit");
var RE2  = require("../../..").RE2;


// tests

unit.add(module, [
	function test_groupsNormal(t) {
		"use strict";

		eval(t.TEST("(new RE2('(?<a>\\\\d)', 'u')).test('9')"));
		eval(t.TEST("t.unify((new RE2('(?<a>-)', 'gu')).match('a-b-c'), ['-', '-'])"));
		eval(t.TEST("t.unify((new RE2('(?<a>-)', 'u')).split('a-b-c'), ['a', '-', 'b', '-', 'c'])"));
		eval(t.TEST("(new RE2('(?<a>-)', 'gu')).search('a-b-c') === 1"));
	},
	function test_groupsExec(t) {
		"use strict";

		var result = (new RE2('(\\d)', 'u')).exec('k9');
		eval(t.TEST("result"));
		eval(t.TEST("result[0] === '9'"));
		eval(t.TEST("result[1] === '9'"));
		eval(t.TEST("result.index === 1"));
		eval(t.TEST("result.input === 'k9'"));
		eval(t.TEST("typeof result.groups == 'undefined'"));

		result = (new RE2('(?<a>\\d)', 'u')).exec('k9');
		eval(t.TEST("result"));
		eval(t.TEST("result[0] === '9'"));
		eval(t.TEST("result[1] === '9'"));
		eval(t.TEST("result.index === 1"));
		eval(t.TEST("result.input === 'k9'"));
		eval(t.TEST("t.unify(result.groups, {a: '9'})"));
	},
	function test_groupsMatch(t) {
		"use strict";

		var result = (new RE2('(\\d)', 'u')).match('k9');
		eval(t.TEST("result"));
		eval(t.TEST("result[0] === '9'"));
		eval(t.TEST("result[1] === '9'"));
		eval(t.TEST("result.index === 1"));
		eval(t.TEST("result.input === 'k9'"));
		eval(t.TEST("typeof result.groups == 'undefined'"));

		result = (new RE2('(?<a>\\d)', 'u')).match('k9');
		eval(t.TEST("result"));
		eval(t.TEST("result[0] === '9'"));
		eval(t.TEST("result[1] === '9'"));
		eval(t.TEST("result.index === 1"));
		eval(t.TEST("result.input === 'k9'"));
		eval(t.TEST("t.unify(result.groups, {a: '9'})"));
	},
	function test_groupsMatch(t) {
		"use strict";

		eval(t.TEST("(new RE2('(?<w>\\\\w)(?<d>\\\\d)', 'gu')).replace('a1b2c', '$2$1') === '1a2bc'"));
		eval(t.TEST("(new RE2('(?<w>\\\\w)(?<d>\\\\d)', 'gu')).replace('a1b2c', '$<d>$<w>') === '1a2bc'"));

		eval(t.TEST("(new RE2('(?<w>\\\\w)(?<d>\\\\d)', 'gu')).replace('a1b2c', replacerByNumbers) === '1a2bc'"));
		eval(t.TEST("(new RE2('(?<w>\\\\w)(?<d>\\\\d)', 'gu')).replace('a1b2c', replacerByNames) === '1a2bc'"));

		function replacerByNumbers(match, group1, group2, index, source, groups) {
			return group2 + group1;
		}
		function replacerByNames(match, group1, group2, index, source, groups) {
			return groups.d + groups.w;
		}
	},
	function test_groupsInvalid(t) {
		"use strict";

		try {
			new RE2('(?<>.)', 'u');
			t.test(false); // shouldn'be here
		} catch(e) {
			eval(t.TEST("e instanceof SyntaxError"));
		}

		// TODO: do we need to enforce the correct id?
		// try {
		// 	RE2('(?<1>.)');
		// 	t.test(false); // shouldn'be here
		// } catch(e) {
		// 	eval(t.TEST("e instanceof SyntaxError"));
		// }

		try {
			new RE2('(?<a>.)(?<a>.)', 'u');
			t.test(false); // shouldn'be here
		} catch(e) {
			eval(t.TEST("e instanceof SyntaxError"));
		}
	}
]);
