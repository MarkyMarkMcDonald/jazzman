var _ = require('lodash/fp');
var stack = require('stack-trace');

var report = require('./report');
var defineTest = require('./define-test');
var describe = require('./describe');
var it = require('./it');
var sequence = require('./sequence');

function expect(subject) {
  return {
    toEqual: function(expected) {
      return subject === expected ?
        {status: 'PASS'}:
        {status: 'FAIL'};
    }
  }
}

module.exports = {
  describe: describe,
  it: it,
  expect: expect,
  sequence: sequence
}
