module.exports = {
  add: function(x,y) { return x + y; },
  addIncorrectly: function(x,y) { return x + y - 100; },
  addAsync: function(x,y) {
    var result = this.add(x, y);

    return {
      then: function(callback) {
        window.setTimeout(function () {
          callback(result)
        }, 1500);
        return this;
      }
    }
  },
  addAsyncSlowly: function(x, y) {
    var result = this.add(x, y);

    return {
      then: function(callback) {
        window.setTimeout(function () {
          callback(result)
        }, 10000);
        return this;
      }
    }
  }
};
