var identity = require('lodash/fp/identity');
var stack = require('stack-trace');

var report = require('../report');
var defineTest = require('./define-test');

module.exports = function it(name, test) {
  function executeIt(buildContext, focusLine) {
    return report(name, test(buildContext()));
  }

  return {
    startLine: stack.get()[1].getLineNumber(),
    definition: defineTest(name, executeIt, identity)
  };
}
