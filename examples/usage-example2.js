var J = require('../justiciar');

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
        }),

        J.describe('and some corrected assumptions', {
          context: function(context) {
            context.x = 1;
            return context;
          },

          tests: [
            J.it('is fine', function(context) {
              return J.expect(context.x + context.y).toEqual(3);
            })
          ]
        })

      ]
    }),

    J.it('can handle multiple expectations', function(context) {
      return [
        J.expect(context.x + context.y).toEqual(3),
        J.expect(context.x + context.y).toEqual(3),
        J.expect(context.x + context.y).toEqual(3)
      ];
    }),

    J.it('can handle expectations throughout a sequence of events', J.sequence([
      function(context) {
        context.x += 1;
        context.z = 'zzzz';
        return J.expect(context.x + context.y).toEqual(4);
      },
      function(context) {
        context.y += 1;
        return J.expect(context.z).toEqual('zzzz');
      },
      function(context) {
        context.x = 1;
        return J.expect(context.x + context.y).toEqual(4);
      }
    ]))
  ]
});
