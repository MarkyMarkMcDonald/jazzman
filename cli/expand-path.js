var fs = require('fs');
var path = require('path');
var colors = require('colors');

var split = require('lodash/fp/split');
var map = require('lodash/fp/map');
var flatMap = require('lodash/fp/flatMap');
var compose = require('lodash/fp/compose');

function prefixedContents(arg) {
  return map(joinDir(arg), fs.readdirSync(arg));
}

function joinDir(dir) {
  return function(file) {
    return path.join(dir, file);
  };
}

var expandDirectory = compose(
  flatMap(expandPath),
  prefixedContents
)

function getFullPath(arg) {
  try {
    return fs.realpathSync(arg);
  } catch (e) {
    console.error(colors.red('ERROR LOCATING SPEC: ' + e.message + '\n'));
    return undefined;
  }
}

function expandPath(arg) {
  var fileAndLine = split(':', arg);
  var fullPath = getFullPath(fileAndLine[0]);
  var line = fileAndLine[1];

  if(fullPath === undefined) return [];

  return fs.statSync(fullPath).isDirectory() ?
    expandDirectory(fullPath) :
    [[fullPath, line]];
}

module.exports = expandPath;
