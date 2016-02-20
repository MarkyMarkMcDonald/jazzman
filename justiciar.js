var _ = require('lodash/fp');

function describe(name, config) {
  var buildContext = config.context || function(){};
  var tests = config.tests || [];

  return function(superContext) {
    function runTest(test) { return test(buildContext(superContext)); }

    var results = _.map(runTest, tests);

    return {
      name: name,
      results: results
    };
  }
}

function it(name, test) {
  return function(context) {
    var result = test(context)

    return {
      name: name,
      results: [result]
    };
  }
}

function expect(subject) {
  return {
    toEqual: function(expected) { return subject === expected ? 'PASS' : 'FAIL'; }
  }
}

module.exports = {
  describe: describe,
  it: it,
  expect: expect
}
