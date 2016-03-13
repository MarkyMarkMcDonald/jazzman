var assert = require('assert');
var defineTest = require('../lib/defining-tests/define-test');

module.exports = function() {
  var superContext = function() { return 'Jazzman'; }

  var subContext = function(context) { return 'More details about ' + context; }

  var fakeTestExecution = function(buildFullContext, focusLine) {
    return buildFullContext() + ' forthcoming at ' + focusLine;
  }

  var definedTest = defineTest('The test', fakeTestExecution, subContext);

  var startLine = 10;
  var endLine = 20;
  var situatedTest = definedTest(startLine, endLine);

  var resultWhenFocusIsBelowTest = situatedTest(superContext, 21);
  var resultWhenFocusIsAboveTest = situatedTest(superContext, 9);
  var resultWhenFocusIsWithinTest = situatedTest(superContext, 11);

  assert.equal(resultWhenFocusIsBelowTest.status, 'OMITTED',
         'This result should have been omitted because the focus was after its endline.');
  assert.equal(resultWhenFocusIsBelowTest.name, 'The test',
         'This report should have been built with the name of the test');

  assert.equal(resultWhenFocusIsAboveTest.status, 'OMITTED',
         'This result should have been omitted because the focus was before its startline.');
  assert.equal(resultWhenFocusIsAboveTest.name, 'The test',
         'This report should have been built with the name of the test');

  assert.equal(resultWhenFocusIsWithinTest, 'More details about Jazzman forthcoming at 11');


  var testSituatedAtBottomOfBlock = definedTest(10, 'END');
  resultWhenFocusIsAboveTest = testSituatedAtBottomOfBlock(superContext, 9);
  resultWhenFocusIsWithinTest = testSituatedAtBottomOfBlock(superContext, 11);

  assert.equal(resultWhenFocusIsAboveTest.status, 'OMITTED',
         'This result should have been omitted because the focus was before its startline.');
  assert.equal(resultWhenFocusIsWithinTest, 'More details about Jazzman forthcoming at 11');
};
