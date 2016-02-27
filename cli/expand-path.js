var fs = require('fs');
var path = require('path');
var colors = require('colors');

var split = require('lodash/fp/split');
var map = require('lodash/fp/map');
var flatMap = require('lodash/fp/flatMap');
var compose = require('lodash/fp/compose');

function prefixedContents(arg) { return compose(map(joinDir(arg)), fs.readdirSync)(arg); }

function joinDir(dir) {
  return function(file) {
    return path.join(dir, file);
  };
}

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
  return [[fs.realpathSync(fileAndLine[0]), fileAndLine[1]]];
}

module.exports = expandPath;
