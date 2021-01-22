## Background

The objective of the re2-wasm library is to implement the JavaScript [RegExp API](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
using the RE2 C++ API compiled into a WASM module. Unfortunately, there are some interface compatibility problems that require intermediate wrapping code to resolve.
In particular, the RE2 API has functions with "out" parameters, which cannot be used in WASM interfaces, so some C++ code is needed to present an API that provides all
of the necessary functionality without using any out parameters. On the other side, the RegExp API uses some types such as RegExp itself that cannot be represented
effectively using WASM, so some JavaScript code is needed to bridge that gap.

## Design

The `RegExp` API functions require the following information/functionality:

 - [`exec`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec):
   - The full match
   - All sub matches
   - The index of the match
   - The original input string
   - If the `g` or `y` flag is set: The RE2 object must record the `lastIndex` where the next search will start, and start searches from `lastIndex`
 - [`test`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test):
   - Whether a match was found
   - If the `g` or `y` flag is set: The RE2 object must record the `lastIndex` where the next search will start
 - [`match`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/match):
   - With the `g` flag and without the `y` flag:
     - A list of all disjoint full matches (equivalent to the full match result from repeatedly calling `exec`, but without modifying `lastIndex`)
   - Without the `g` flag:
     - The full match
     - All sub matches
     - The index of the match
     - The original input string
     - If the `y` flag is set: The RE2 object must record the `lastIndex` where the next search will start, and start searches from `lastIndex`
 - [`search`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/search):
   - The index of the first match (not modified by the `g` or `y` flags)
 - [`replace`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace):
   - The full match
   - All sub matches
   - The index of the match
   - The last index or length of the match
   - The original input string
   - With the `g` flag and without the `y` flag, all of this information is needed for every disjoint full match
   - With the `y` flag, `lastIndex` is used and updated
 - [`split`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split)
   - The index and length of any number of full matches (can be all of them, bounded above by `limit` if set)
   - All sub matches for each match
   - The `g` and `y` flags are irrelevant

This can be achieved with a `match` function that takes as arguments the input string, the starting search index, and a boolean indicating whether to look for capture groups,
and returns a single match object containing the full match, its index, and an array of sub match strings. The returned index is `-1` on failure The JavaScript layer above it can track the
`lastIndex`.