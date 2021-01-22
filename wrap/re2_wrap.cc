/*    Copyright 2021 Google LLC
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0

 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 */

#include <memory>

#include <emscripten/bind.h>
#include <emscripten/val.h>
#include <re2/re2.h>
#include <re2/stringpiece.h>

using namespace emscripten;

/* Copied from 
 * https://github.com/uhop/node-re2/blob/c2179c5402f5c426e6b8b87ca46c98d2638623ac/lib/wrapped_re2.h#L147 */
inline size_t getUtf8CharSize(char ch)
{
	return ((0xE5000000 >> ((ch >> 3) & 0x1E)) & 3) + 1;
}

static std::shared_ptr<re2::RE2::Options> getOptionsFromFlags(const bool ignoreCase, const bool multiline, const bool dotAll) {
  std::shared_ptr<re2::RE2::Options> options = std::make_shared<re2::RE2::Options>();
  options->set_log_errors(false);
  options->set_case_sensitive(!ignoreCase);
  options->set_one_line(!multiline);
  options->set_dot_nl(dotAll);
  return options;
}

class WrappedRE2 {
  public:
    WrappedRE2(const std::string& pattern, const bool ignoreCase, const bool multiline, const bool dotAll):
      wrapped(re2::StringPiece(pattern), *getOptionsFromFlags(ignoreCase, multiline, dotAll)) {}

    bool ok() const {
      return wrapped.ok();
    }

    const std::string& error() const {
      return wrapped.error();
    }

    const std::string& pattern() const {
      return wrapped.pattern();
    }

    const val match(const std::string& input, const size_t start, const bool getCaptureGroups) {
      /* There is some potential additional optimization here: for the test
       * method, no match information is needed, so the submatchCount could be
       * 0. For API simplicity, we are currently not doing that. */
      int submatchCount = getCaptureGroups ? wrapped.NumberOfCapturingGroups() + 1 : 1;
      re2::StringPiece matches[submatchCount];
      // Convert an index into a UTF8 string to a byte offset
      size_t byteStart = 0;
      for (size_t i = 0; i < start; i++) {
        byteStart += getUtf8CharSize(input[byteStart]);
      }
      bool success = wrapped.Match(re2::StringPiece(input), byteStart, input.size(), RE2::UNANCHORED, matches, submatchCount);
      val result = val::object();
      if (success) {
        re2::StringPiece matchResult = matches[0];
        result.set("match", static_cast<std::string>(matchResult));
        // Convert a byte offset to a UTF8 index
        size_t byteIndex = matchResult.data() - input.data();
        size_t utf8Index = 0;
        for (size_t i = 0; i < byteIndex; i += getUtf8CharSize(input[i])) {
          utf8Index += 1;
        }
        result.set("index", utf8Index);
        val captureGroups = val::array();
        if (getCaptureGroups) {
          for (size_t index = 1; index < submatchCount; index++) {
            if (matches[index].data() == NULL) {
              captureGroups.set(index - 1, val::undefined());
            } else {
              captureGroups.set(index - 1, static_cast<std::string>(matches[index]));
            }
          }
        }
        result.set("groups", captureGroups);
      } else {
        result.set("match", "");
        result.set("index", -1);
        result.set("groups", val::array());
      }
      return val(result);
    }

  const std::map<int, std::string>& capturingGroupNames() const {
    return wrapped.CapturingGroupNames();
  }

  private:
    re2::RE2 wrapped;
};

EMSCRIPTEN_BINDINGS(re2) {
  class_<WrappedRE2>("WrappedRE2")
    .smart_ptr_constructor("WrappedRE2", std::make_shared<WrappedRE2, const std::string&, const bool, const bool, const bool>)
    .function("ok", &WrappedRE2::ok)
    .function("error", &WrappedRE2::error)
    .function("pattern", &WrappedRE2::pattern)
    .function("match", &WrappedRE2::match)
    .function("capturingGroupNames", &WrappedRE2::capturingGroupNames);

  register_vector<int>("vector<int>");
  register_map<int, std::string>("map<int, string>");
}