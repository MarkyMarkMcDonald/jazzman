var cli = require('cli').enable('glob');
var split = require('lodash/fp/split');
var map = require('lodash/fp/map');
var each = require('lodash/fp/each');
var compose = require('lodash/fp/compose');

var run = require('./run');
var printReport = require('./print-report');

function withDestructuredPair(fn) {
  return function(pair) {
    return fn(pair[0], pair[1]);
  };
}

function runSuite(file, line) {
  return run(require('./' + file), line);
}

cli.main(
  compose(
    each(printReport),
    map(withDestructuredPair(runSuite)),
    map(split(':'))
  )
);

