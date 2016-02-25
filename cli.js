var cli = require('cli').enable('glob');
var fs = require('fs');
var colors = require('colors');

var split = require('lodash/fp/split');
var map = require('lodash/fp/map');
var flatMap = require('lodash/fp/flatMap');
var each = require('lodash/fp/each');
var compose = require('lodash/fp/compose');
var prefix = require('lodash/fp/add');

var run = require('./run');
var printReport = require('./print-report');

function expandDirectory(arg) {
  return compose(
    flatMap(expandPath),
    map(prefix(arg)),
    fs.readdirSync
  )(arg);
}

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
  if(!stat) return [];

  return stat.isDirectory() ?
    expandDirectory(fileAndLine[0]) :
    [fileAndLine];
}

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
    flatMap(expandPath)
  )
);

