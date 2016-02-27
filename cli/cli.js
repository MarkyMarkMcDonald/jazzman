var cli = require('cli').enable('glob');

var map = require('lodash/fp/map');
var flatMap = require('lodash/fp/flatMap');
var each = require('lodash/fp/each');
var compose = require('lodash/fp/compose');
var spread = require('lodash/fp/spread');

var expandPath = require('./expand-path');
var printReport = require('./print-report');
var run = require('../run');

function runSuite(file, line) {
  return run(require(file), line);
}

cli.main(
  compose(
    each(printReport),
    map(spread(runSuite)),
    flatMap(expandPath)
  )
);

