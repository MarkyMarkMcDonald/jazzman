var _ = require('lodash/fp');
var stack = require('stack-trace');

var report = require('./report');
var defineTest = require('./define-test');
var describe = require('./describe');
var it = require('./it');

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
