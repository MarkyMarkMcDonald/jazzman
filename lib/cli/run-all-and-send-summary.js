var map = require('lodash/fp/map');
var flatMap = require('lodash/fp/flatMap');
var each = require('lodash/fp/each');
var compose = require('lodash/fp/compose');
var spread = require('lodash/fp/spread');

var expandPath = require('./expand-path');
var run = require('../run');

function runSuite(file, line) {
  return run(require(file), line);
}

module.exports = function(reporter) {
  return compose(
    each(reporter),
    map(spread(runSuite)),
    flatMap(expandPath)
  );
};
