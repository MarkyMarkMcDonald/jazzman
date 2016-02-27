var _ = require('lodash/fp');
var stack = require('stack-trace');

var report = require('./report');
var defineTest = require('./define-test');
var describe = require('./describe');

function it(name, test) {
  function executeIt(buildContext, focusLine) {
    return report(name, test(buildContext()));
  }

  return defineTest(name, executeIt, _.identity, stack.get()[1].getLineNumber());
}

function expect(subject) {
  return {
    toEqual: function(expected) {
      return subject === expected ?
        {status: 'PASS'}:
        {status: 'FAIL'};
    }
  }
}

function sequence(tests) {
  return function(context) {
    return _.flatMap(function(test) { return test(context); }, tests);
  };
}

module.exports = {
  describe: describe,
  it: it,
  expect: expect,
  sequence: sequence
}
