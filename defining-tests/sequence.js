var flatMap = require('lodash/fp/flatmap');

module.exports = function sequence(tests) {
  return function(context) {
    return flatMap(function(test) { return test(context); }, tests);
  };
};
