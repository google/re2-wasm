The directory `third_party/node-re2/` is a copy of [node-re2](https://github.com/uhop/node-re2), keeping only the `tests` folder. Those tests were modified to test this library as follows:

 - Imports were changed to match this library.
 - `RE2(arg)` was replaced with `new RE2(arg)` because it is only callable as a constructor in this library.
 - The `u` flag was added to all `RE2` constructor calls because it is required in this library.
 - Tests for `Buffer` handling were removed because this library does not handle `Buffers`.