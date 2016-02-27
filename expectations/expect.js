module.exports = function expect(subject) {
  return {
    toEqual: function(expected) {
      return subject === expected ?
        {status: 'PASS'}:
        {status: 'FAIL'};
    }
  }
};
