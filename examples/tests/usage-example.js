var J = require('../../jazzman');

module.exports = J.describe('Basic addition', {

  context: function() {
    return {
      objectUnderTest: require('../addition'),
    };
  },

  tests: [

    J.it('confirms that 2+2=4', function(context) {
      return J.expect(context.objectUnderTest.add(2,2)).toEqual(4);
    }),

    J.it('is commutative', function(context) {
      return [
        J.expect(context.objectUnderTest.add(3,4)).toEqual(7),
        J.expect(context.objectUnderTest.add(4,3)).toEqual(7)
      ];
    }),

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
              var sum = context.objectUnderTest.add(context.x, context.y);
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
              var sum = context.objectUnderTest.add(context.x, context.y);
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

    J.it('can do even more math using previous math', J.sequence([
      function(context) {
        context.resultSoFar = context.objectUnderTest.add(1,5);
        return J.expect(context.resultSoFar).toEqual(6);
      },
      function(context) {
        context.resultSoFar = context.objectUnderTest.add(context.resultSoFar,2);
        return J.expect(context.resultSoFar).toEqual(8);
      },
      function(context) {
        context.resultSoFar = context.objectUnderTest.add(context.resultSoFar,2);
        return J.expect(context.resultSoFar).toEqual(10);
      }
    ]))
  ]
});
