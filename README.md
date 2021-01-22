# re2-wasm [![NPM version][npm-img]][npm-url]

[npm-img]: https://img.shields.io/npm/v/re2-wasm.svg
[npm-url]: https://npmjs.org/package/re2-wasm

This README is modified from the node-re2 README, licensed under The "New" BSD License

This project provides bindings for [RE2](https://github.com/google/re2):
fast, safe alternative to backtracking regular expression engines written by [Russ Cox](http://swtch.com/~rsc/).
To learn more about RE2, start with an overview
[Regular Expression Matching in the Wild](http://swtch.com/~rsc/regexp/regexp3.html). More resources can be found
at his [Implementing Regular Expressions](http://swtch.com/~rsc/regexp/) page.

`RE2`'s regular expression language is almost a superset of what is provided by `RegExp`
(see [Syntax](https://github.com/google/re2/wiki/Syntax)),
but it lacks two features: backreferences and lookahead assertions. See below for more details.

`RE2` object emulates standard `RegExp` making it a practical drop-in replacement in most cases.
`RE2` is extended to provide `String`-based regular expression methods as well. To help to convert
`RegExp` objects to `RE2` its constructor can take `RegExp` directly honoring all properties.

## Why use node-re2?

The built-in Node.js regular expression engine can run in exponential time with a special combination:
 - A vulnerable regular expression
 - "Evil input"

This can lead to what is known as a [Regular Expression Denial of Service (ReDoS)](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS).
To tell if your regular expressions are vulnerable, you might try the one of these projects:
 - [rxxr2](http://www.cs.bham.ac.uk/~hxt/research/rxxr2/)
 - [safe-regex](https://github.com/substack/safe-regex)

However, neither project is perfect.

node-re2 can protect your Node.js application from ReDoS.
node-re2 makes vulnerable regular expression patterns safe by evaluating them in `RE2` instead of the built-in Node.js regex engine.

## Standard features

`RE2` object can be created just like `RegExp`:

* [`new RE2(pattern[, flags])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)

Supported properties:

* [`re2.lastIndex`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex)
* [`re2.global`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/global)
* [`re2.ignoreCase`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/ignoreCase)
* [`re2.multiline`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/multiline)
* [`re2.unicode`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/unicode)
  * `RE2` engine always works in the Unicode mode. See details below.
* [`re2.sticky`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/sticky)
* [`re2.source`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/source)
* [`re2.flags`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/flags)

Supported methods:

* [`re2.exec(str)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec)
* [`re2.test(str)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test)
* [`re2.toString()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/toString)

The following well-known symbol-based methods are supported (see [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)):

* [`re2[Symbol.match](str)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/match)
* [`re2[Symbol.search](str)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/search)
* [`re2[Symbol.replace](str, newSubStr|function)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/replace)
* [`re2[Symbol.split](str[, limit])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol/split)

It allows to use `RE2` instances on strings directly, just like `RegExp` instances:

```js
var re = new RE2("1", 'u');
"213".match(re);        // [ '1', index: 1, input: '213' ]
"213".search(re);       // 1
"213".replace(re, "+"); // 2+3
"213".split(re);        // [ '2', '3' ]
```

[Named groups](https://tc39.github.io/proposal-regexp-named-groups/) are supported.

## Extensions

### Shortcut construction

`RE2` object can be created from a regular expression:

```js
var re1 = new RE2(/ab*/igu); // from a RegExp object
var re2 = new RE2(re1);     // from another RE2 object
```

### `String` methods

Standard `String` defines four more methods that can use regular expressions. `RE2` provides them as methods
exchanging positions of a string, and a regular expression:

* `re2.match(str)`
  * See [`str.match(regexp)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match)
* `re2.replace(str, newSubStr|function)`
  * See [`str.replace(regexp, newSubStr|function)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace)
* `re2.search(str)`
  * See [`str.search(regexp)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search)
* `re2.split(str[, limit])`
  * See [`str.split(regexp[, limit])`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)

### Property: `internalSource`

Starting 1.8.0 property `source` emulates the same property of `RegExp`, meaning that it can be used to create an identical `RE2` or `RegExp` instance. Sometimes, for troubleshooting purposes, a user wants to inspect a `RE2` translated source. It is available as a read-only property called `internalSource`.

### Unicode Mode

The `RE2` engine only works in Unicode mode, so the `RE2` class must always be constructed with the `u` flag to enable unicode mode.

## How to install

Installation:

```
npm install --save re2-wasm
```

## How to use

It is used just like a `RegExp` object.

```js
var { RE2 } = require("re2-wasm");

// with default flags
var re = new RE2("a(b*)", 'u');
var result = re.exec("abbc");
console.log(result[0]); // "abb"
console.log(result[1]); // "bb"

result = re.exec("aBbC");
console.log(result[0]); // "a"
console.log(result[1]); // ""

// with explicit flags
re = new RE2("a(b*)", "iu");
result = re.exec("aBbC");
console.log(result[0]); // "aBb"
console.log(result[1]); // "Bb"

// from regular expression object
var regexp = new RegExp("a(b*)", "iu");
re = new RE2(regexp);
result = re.exec("aBbC");
console.log(result[0]); // "aBb"
console.log(result[1]); // "Bb"

// from regular expression literal
re = new RE2(/a(b*)/iu);
result = re.exec("aBbC");
console.log(result[0]); // "aBb"
console.log(result[1]); // "Bb"

// from another RE2 object
var rex = new RE2(re);
result = rex.exec("aBbC");
console.log(result[0]); // "aBb"
console.log(result[1]); // "Bb"

// shortcut
result = new RE2("ab*", 'u').exec("abba");
```

## Limitations (things RE2 does not support)

`RE2` consciously avoids any regular expression features that require worst-case exponential time to evaluate.
These features are essentially those that describe a Context-Free Language (CFL) rather than a Regular Expression,
and are extensions to the traditional regular expression language because some people don't know when enough is enough.

The most noteworthy missing features are backreferences and lookahead assertions.
If your application uses these features, you should continue to use `RegExp`.
But since these features are fundamentally vulnerable to
[ReDoS](https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS),
you should strongly consider replacing them.

`RE2` will throw a `SyntaxError` if you try to declare a regular expression using these features.
If you are evaluating an externally-provided regular expression, wrap your `RE2` declarations in a try-catch block. It allows to use `RegExp`, when `RE2` misses a feature:

```js
var re = /(a)+(b)*/u;
try {
  re = new RE2(re);
  // use RE2 as a drop-in replacement
} catch (e) {
  // suppress an error, and use
  // the original RegExp
}
var result = re.exec(sample);
```

In addition to these missing features, `RE2` also behaves somewhat differently from the built-in regular expression engine in corner cases.

### Backreferences

`RE2` doesn't support backreferences, which are numbered references to previously
matched groups, like so: `\1`, `\2`, and so on. Example of backrefrences:

```js
/(cat|dog)\1/.test("catcat"); // true
/(cat|dog)\1/.test("dogdog"); // true
/(cat|dog)\1/.test("catdog"); // false
/(cat|dog)\1/.test("dogcat"); // false
```

### Lookahead assertions

`RE2` doesn't support lookahead assertions, which are ways to allow a matching dependent on subsequent contents.

```js
/abc(?=def)/; // match abc only if it is followed by def
/abc(?!def)/; // match abc only if it is not followed by def
```

### Mismatched behavior

`RE2` and the built-in regex engines disagree a bit. Before you switch to `RE2`, verify that your regular expressions continue to work as expected. They should do so in the vast majority of cases.

Here is an example of a case where they may not:

```js
var { RE2 }  = require("re2-wasm");

var pattern = '(?:(a)|(b)|(c))+';

var built_in = new RegExp(pattern);
var re2 = new RE2(pattern, 'u');

var input = 'abc';

var bi_res = built_in.exec(input);
var re2_res = re2.exec(input);

console.log('bi_res: ' + bi_res);    // prints: bi_res: abc,,,c
console.log('re2_res : ' + re2_res); // prints: re2_res : abc,a,b,c
```

### Unicode

`RE2` only works in the Unicode mode. The `u` flag must be passed to the `RE2` constructor.

## Release history

- 1.15.9 *Updated deps.*
- 1.15.8 *Updated deps.*
- 1.15.7 *Updated deps.*
- 1.15.6 *Technical release: less dependencies for the build.*
- 1.15.5 *Updated deps. Fixed a `node2nix`-related problem (thx [malte-v](https://github.com/malte-v)).*
- 1.15.4 *Updated deps. Fixed a yarn-related bug (thx [Michael Kriese](https://github.com/viceice)).*
- 1.15.3 *Extracted caching artifacts to separate packages. Added support for `RE2_DOWNLOAD_MIRROR` environment variable for precompiled artifact download during installation.*
- 1.15.2 *Added `linux-musl` target for precompiled images (thx [Uzlopak](https://github.com/Uzlopak)).*
- 1.15.1 *Refreshed dependencies, updated the verification check on installation, general maintenance.*
- 1.15.0 *Fix for multiline expressions (thx [Frederic Rudman](https://github.com/frudman)), `toString()` uses `source` now, updated deps.*
- 1.14.0 *New delivery mechanism for binary artifacts (thx [Brandon Kobel](https://github.com/kobelb) for the idea and the research) + minor fix to eliminate warnings on Windows.*
- 1.13.1 *Fix for Windows builds.*
- 1.13.0 *Got rid of a single static variable to support multithreading.*
- 1.12.1 *Updated re2 to the latest version.*
- 1.12.0 *Updated the way `RE2` objects are constructed.*
- 1.11.0 *Updated the way to initialize the extension (thx [BannerBomb](https://github.com/BannerBomb)).*
- 1.10.5 *Bugfix for optional groups (thx [Josh Yudaken](https://github.com/qix)), the latest version of re2.*
- 1.10.4 *Technical release: even better TypeScript types (thx [Louis Brann](https://github.com/louis-brann)).*
- 1.10.3 *Technical release: missing reference to TS types (thx [Jamie Magee](https://github.com/JamieMagee)).*
- 1.10.2 *Technical release: added TypeScript types (thx [Jamie Magee](https://github.com/JamieMagee)).*
- 1.10.1 *Updated re2 to the latest version (thx [Jamie Magee](https://github.com/JamieMagee)), dropped Node 6.*
- 1.10.0 *Added back support for Node 6 and Node 8. Now Node 6-12 is supported.*
- 1.9.0 *Refreshed dependencies to support Node 12. Only versions 10-12 are supported now (`v8` restrictions). For older versions use `node-re2@1.8`.*
- 1.8.4 *Refreshed dependencies, removed `unistd.h` to compile on Windows.*
- 1.8.3 *Refreshed dependencies, removed suppression of some warnings.*
- 1.8.2 *Bugfix to support the null prototype for groups. Thx [Exter-N](https://github.com/Exter-N).*
- 1.8.1 *Bugfix for better source escaping.*
- 1.8.0 *Clarified Unicode support, added `unicode` flag, added named groups &mdash; thx [Exter-N](https://github.com/Exter-N)! Bugfixes &mdash; thx [Barak Amar](https://github.com/nopcoder).*
- 1.7.0 *Implemented `sticky` and `flags` + bug fixes + more tests. Thx [Exter-N](https://github.com/Exter-N).*
- 1.6.2 *Bugfix for a prototype access. Thx [Exter-N](https://github.com/Exter-N).*
- 1.6.1 *Returned support for node 4 LTS. Thx [Kannan Goundan](https://github.com/cakoose).*
- 1.6.0 *Added well-known symbol-based methods of ES6. Refreshed NAN.*
- 1.5.0 *Bugfixes, error checks, better docs. Thx [Jamie Davis](https://github.com/davisjam), and [omg](https://github.com/omg).*
- 1.4.1 *Minor corrections in README.*
- 1.4.0 *Use re2 as a git submodule. Thx [Ben James](https://github.com/benhjames).*
- 1.3.3 *Refreshed dependencies.*
- 1.3.2 *Updated references in README (re2 was moved to github).*
- 1.3.1 *Refreshed dependencies, new Travis-CI config.*
- 1.3.0 *Upgraded NAN to 1.6.3, now we support node.js 0.10.36, 0.12.0, and io.js 1.3.0. Thx [Reid Burke](https://github.com/reid)!*
- 1.2.0 *Documented getUtfXLength() functions. Added support for `\c` and `\u` commands.*
- 1.1.1 *Minor corrections in README.*
- 1.1.0 *Buffer-based API is public. Unicode is fully supported.*
- 1.0.0 *Implemented all `RegExp` methods, and all relevant `String` methods.*
- 0.9.0 *The initial public release.*

## License

BSD
