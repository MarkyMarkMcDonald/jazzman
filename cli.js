var cli = require('cli').enable('glob');
var fs = require('fs');
var colors = require('colors');

var split = require('lodash/fp/split');
var map = require('lodash/fp/map');
var flatMap = require('lodash/fp/flatMap');
var each = require('lodash/fp/each');
var compose = require('lodash/fp/compose');
var prefix = require('lodash/fp/add');
var spread = require('lodash/fp/spread');

var run = require('./run');
var printReport = require('./print-report');

function prefixedContents(arg) { return compose(map(prefix(arg)), fs.readdirSync)(arg); }

var expandDirectory = compose(
  flatMap(expandPath),
  prefixedContents
)

function getFsStat(arg) {
  try {
    return fs.statSync(arg);
  } catch (e) {
    console.error(colors.red('ERROR LOCATING SPEC: ' + e.message + '\n'));
    return undefined;
  }
}

function expandPath(arg) {
  var fileAndLine = split(':', arg);
  var stat = getFsStat(fileAndLine[0]);

  if(stat === undefined) return [];
  if(stat.isDirectory()) return expandDirectory(fileAndLine[0]);
  return [fileAndLine];
}

function runSuite(file, line) {
  return run(require('./' + file), line);
}

cli.main(
  compose(
    each(printReport),
    map(spread(runSuite)),
    flatMap(expandPath)
  )
);

