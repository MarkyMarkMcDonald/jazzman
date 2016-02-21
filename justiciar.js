var _ = require('lodash/fp');
var stack = require('stack-trace');

function runTest(name, execute, buildContext, startLine) {
  var filterableTest = function(endLine) {
    return function(buildSuperContext, focusLine) {
      if(testSuppressedByLineFocus(startLine, endLine, focusLine)) {
        return {
          name: name,
          status: 'OMITTED',
          results: []
        };
      } else {
        return execute(function() { return buildContext(buildSuperContext()); }, focusLine);
      }
    };
  };

  filterableTest.startLine = startLine;
  return filterableTest;
}

function describe(name, config) {
  var definedAt = stack.get()[1];
  var buildContext = config.context || _.identity;
  var testDefinitions = config.tests || [];

  var tests = _.map(function(testPair) {
    return testPair[0](testPair[1].startLine);
  }, staggerredZip(testDefinitions, 'END'));

  function executeDescribe(context, focusLine) {
    if(focusLine >= definedAt.getLineNumber() && focusLine < testDefinitions[0].startLine) {
      focusLine = undefined;
    }

    var results = _.map(function(test) {
      return test(context, focusLine);
    }, tests);

    return {
      name: name,
      status: aggregateStatus(results),
      results: results
    };
  }

  return runTest(name, executeDescribe, buildContext, definedAt.getLineNumber());
}

function staggerredZip(array, finalElement) {
  return _.zip(array, _.concat(_.tail(array), [finalElement]));
}

function testSuppressedByLineFocus(startLine, endLine, focusLine) {
  return focusLine && (startLine > focusLine || (endLine !== 'END' && endLine <= focusLine));
}

function aggregateStatus(results) {
  if(_.some(function(result) { return result === 'FAIL'; }, results)) return 'FAIL';
  if(_.every(function(result) { return result === 'OMITTED'; }, results)) return 'OMITTED';
  return 'PASS';
}

function it(name, test) {
  function executeIt(context, focusLine) {
    var result = test(context());
    return {
      name: name,
      status: result,
      results: [result]
    };
  }

  return runTest(name, executeIt, _.identity, stack.get()[1].getLineNumber());
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
