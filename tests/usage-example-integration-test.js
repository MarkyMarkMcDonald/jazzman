var assert = require('assert');
var path = require('path');
var find = require('lodash/find');
var reject = require('lodash/reject');
var every = require('lodash/every');

var runAll = require('../lib/cli/run-all-and-send-summary');

module.exports = function() {
  testWithDirectoryArgument();
  testWithFocusLine();
};

function testWithDirectoryArgument() {
  var exampleDirectory = path.join(__dirname, '..', 'examples', 'tests');
  var reports = collectReports(exampleDirectory);

  assert.equal(reports.length, 1, 'Should have received exactly one top-level report');
  var topLevelReport = reports[0];

  assert.equal(topLevelReport.name, 'Basic addition');
  assert.equal(topLevelReport.status, 'FAIL');
  assert.equal(topLevelReport.results.length, 4, 'Top level report should have 4 child results');

  assertAboutResult(topLevelReport.results, 'confirms that 2+2=4', function(result){
    assert.equal(result.status, 'PASS');
  });

  assertAboutResult(topLevelReport.results, 'is commutative', function(result){
    assert.equal(result.status, 'PASS');
    assert.equal(result.results.length, 2, '"is commutative" test should have returned two expectations');
  });

  assertAboutResult(topLevelReport.results, 'when the first number is 1', function(result){
    assert.equal(result.status, 'FAIL');
    assert.equal(result.results.length, 2, '"when the first number is 1" block should have two child results');

    assertAboutResult(result.results, 'and the second number is 2', function(onePlusTwoResult) {
      assert.equal(onePlusTwoResult.status, 'PASS');
    });

    assertAboutResult(result.results, 'and the second number is 3', function(onePlusThreeResult) {
      assert.equal(onePlusThreeResult.status, 'FAIL');

      assertAboutResult(onePlusThreeResult.results, 'returns 4', function(passingResult) {
        assert.equal(passingResult.status, 'PASS');
      });

      assertAboutResult(onePlusThreeResult.results, 'this test fails', function(failingResult) {
        assert.equal(failingResult.status, 'FAIL');
        assert.equal(failingResult.results[0].message, 'Expected -96 to equal 4');
      });
    });
  });

  assertAboutResult(topLevelReport.results, 'can do even more math using previous math', function(result){
    assert.equal(result.status, 'PASS');
    assert.equal(result.results.length, 3, '"can do even more math" test should have returned three expectations');
  });
}

function testWithFocusLine() {
  var examplePath = path.join(
    __dirname, '..', 'examples', 'tests', 'usage-example.js:14'
  );

  var report = collectReports(examplePath)[0];
  assert.equal(report.status, 'PASS');

  assertAboutResult(report.results, 'confirms that 2+2=4', function(result) {
    assert.equal(report.status, 'PASS');
  });

  var otherResults = reject(report.results, ['name', 'confirms that 2+2=4']);
  assert(every(otherResults, ['status','OMITTED']), 'every other result should have been omitted on account of the focus line');
}


function collectReports(pathArgument) {
  var reports = [];
  function addReport(report) { reports.push(report); }
  runAll(addReport)([pathArgument]);
  return reports;
}

function assertAboutResult(results, resultName, handle) {
  var resultOfInterest = find(results, ['name', resultName]);
  assert(resultOfInterest != undefined, 'Expected to find a result named ' + resultName);
  handle(resultOfInterest);
}
