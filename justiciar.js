var _ = require('lodash/fp');
var stack = require('stack-trace');

var Report = require('./report');

function markStartLine(startLine, fn) {
  fn.startLine = startLine;
  return fn;
}

function buildFullContext(buildContext, buildSuperContext) {
  return function() {
    return buildContext(buildSuperContext());
  }
}

function runTest(name, execute, buildContext, startLine) {
  return markStartLine(startLine, function(endLine) {
    return function(buildSuperContext, focusLine) {
      return testSuppressedByLineFocus(startLine, endLine, focusLine) ?
        Report.omitted(name) :
        execute(buildFullContext(buildContext, buildSuperContext), focusLine) ;
    };
  });
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

    return Report(name, results);
  }

  return runTest(name, executeDescribe, buildContext, definedAt.getLineNumber());
}

function staggerredZip(array, finalElement) {
  return _.zip(array, _.concat(_.tail(array), [finalElement]));
}

function testSuppressedByLineFocus(startLine, endLine, focusLine) {
  return focusLine && (startLine > focusLine || (endLine !== 'END' && endLine <= focusLine));
}

function it(name, test) {
  function executeIt(buildContext, focusLine) {
    return Report(name, test(buildContext()));
  }

  return runTest(name, executeIt, _.identity, stack.get()[1].getLineNumber());
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
