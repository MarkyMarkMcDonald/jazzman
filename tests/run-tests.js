var compose = require('lodash/fp/compose');
var map = require('lodash/fp/map');
var allPass = require('lodash/fp/every')(require('lodash/fp/identity'));
var reject = require('lodash/fp/reject');
var fs = require('fs');
var path = require('path');

var tests = compose(
  reject(function(file) { return file === __filename; }),
  map(function(file) { return path.join(__dirname, file); }),
  fs.readdirSync
)(__dirname);

function runTest(test) {
  try {
    require(test)();
    console.log('PASS: ' + test);
    return true;
  } catch (e) {
    console.log('');
    console.log('FAIL: ' + test);
    console.log(e);
    console.log(e.stack);
    console.log('');
    return false;
  }
}

function summarize(results) {
  console.log('');
  if(allPass(results)) {
    console.log('+++++++++++++++++++++++++++++');
    console.log('++++++++++ GREEN ++++++++++++');
    console.log('+++++++++++++++++++++++++++++');
    console.log('');
    return true;
  } else {
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('xxxxxxxxxx  RED  xxxxxxxxxxxx');
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('');
    return false;
  }
}

function exitAccordingToOverallResult(allPassed) {
  allPassed ?
    process.exit(0):
    process.exit(1);
}

compose(
  exitAccordingToOverallResult,
  summarize,
  map(runTest)
)(tests);
