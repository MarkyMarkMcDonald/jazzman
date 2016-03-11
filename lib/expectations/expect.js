var stack = require('stack-trace');
var toString = require('lodash/fp').toString;

module.exports = function expect(subject) {
  var definedAt = stack.get()[1];
  return {
    toEqual: function(expected) {
      if(subject === expected) {
        return {
          status: 'PASS',
          message: '',
          location: definedAt
        };
      } else {
        return {
          status: 'FAIL',
          message: 'Expected ' + toString(subject) + ' to equal ' + toString(expected),
          location: definedAt
        };
      }
    }
  }
};
