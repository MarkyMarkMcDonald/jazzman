var J = require('./justiciar');

module.exports = J.describe('Basic math', {

  context: function() {
    return {
      x: 1,
      y: 2
    };
  },

  tests: [

    J.it('can add correctly', function(context) {
      return J.expect(context.x + context.y).toEqual(3);
    }),

    J.describe('with some wrong assumptions', {

      context: function(context) {
        context.x = 5;
        return context;
      },

      tests: [

        J.it('causes problems', function(context) {
          return J.expect(context.x + context.y).toEqual(3);
        })

      ]
    }),

    J.it('can handle multiple expectations', function(context) {
      return [
        J.expect(context.x + context.y).toEqual(3),
        J.expect(context.x + context.y).toEqual(3),
        J.expect(context.x + context.y).toEqual(3)
      ];
    })
  ]
});
