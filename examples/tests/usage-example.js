var J = require('../../justiciar');

module.exports = J.describe('Basic addition', {

  context: function() {
    return {
      objectUnderTest: require('../addition'),
    };
  },

  tests: [

    J.describe('when the first number is 1', {

      context: function(context) {
        context.x = 1;
        return context;
      },

      tests: [

        J.describe('and the second number is 2', {
          context: function(context) {
            context.y = 2;
            return context;
          },

          tests: [
            J.it('returns 3', function(context) {
              var sum = context.objectUnderTest.addCorrectly(context.x, context.y);
              return J.expect(sum).toEqual(3);
            })
          ]
        }),

        J.describe('and the second number is 3', {
          context: function(context) {
            context.y = 3;
            return context;
          },

          tests: [
            J.it('returns 4', function(context) {
              var sum = context.objectUnderTest.addCorrectly(context.x, context.y);
              return J.expect(sum).toEqual(4);
            }),

            J.it('this test fails', function(context) {
              return J.expect(
                context.objectUnderTest.addIncorrectly(context.x, context.y)
              ).toEqual(4);
            })
          ]
        }),

      ]
    }),

    J.it('is commutative', function(context) {
      return [
        J.expect(context.objectUnderTest.addCorrectly(3,4)).toEqual(7),
        J.expect(context.objectUnderTest.addCorrectly(4,3)).toEqual(7)
      ];
    }),

    J.it('can handle expectations throughout a sequence of events', J.sequence([
      function(context) {
        context.resultSoFar = context.objectUnderTest.addCorrectly(1,5);
        return J.expect(context.resultSoFar).toEqual(6);
      },
      function(context) {
        context.resultSoFar = context.objectUnderTest.addCorrectly(context.resultSoFar,2);
        return J.expect(context.resultSoFar).toEqual(8);
      },
      function(context) {
        context.resultSoFar = context.objectUnderTest.addCorrectly(context.resultSoFar,2);
        return J.expect(context.resultSoFar).toEqual(10);
      }
    ]))
  ]
});
