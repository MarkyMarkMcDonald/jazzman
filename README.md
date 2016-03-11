# jazzman

<i>Lift me, won't you lift me above the old routine?<br/>
Make it nice, play it clean, Jazzman</i><br/>
-- Carole King

## What is Jazzman?

Jazzman is a test framework you can use for testing your javascript code,
similar to Jasmine, Mocha, or such. It uses BDD-style language ("describe",
"it", "expect") and optimizes for clarity in creating the context for your
test.

## Why do we need another javascript test framework?

We don't!

If you need a test harness for real work, you should probably use a well-vetted
solution like Jasmine.

On the other hand, if you're interested in experimenting with writing specs a
little differently, playing with Jazzman could be a fun exercise.

Jazzman focuses on the idea of a test as a function that takes a context and
returns a result. The DSL is designed to be lightly opinionated and encourage a
particular way of thinking about the structure of a test: not as a
before/then sequence, but instead as a context in which an expectation is made.

Also, Jazzman tries to avoid the gotchas associated with different execution
scopes--e.g., in Jasmine, accidentally calling `expect` inside a describe-block
instead of an it-block.  Jazzman rigs its test syntax to make such errors more
glaringly obvious.

Finally, Jazzman is meant to be small, and easy for people to crack open the
source and have a look around.

## How do you get it?

For the moment, clone the repo and require `jazzman.js` at the top of your test
file. npm release coming soon!

## How do you use it?

For a working usage example, check out the `examples/tests/` directory. You can
run the example tests with:

````bash
$ node lib/cli/cli.js examples/tests/
````

`jazzman.js` exports an object containing the various test utilities, including
the `describe` function. Your test file should export an invocation of
`describe`, like so:

````javascript
var J = require('./jazzman');

module.exports = J.describe('a test suite!', {
  tests: [

    it('makes it nice', function() {
      return J.expect(true).toEqual(true);
    }),

    it('plays it clean', function() {
      return J.expect(false).toEqual(false);
    })

  ]
});
````

### Using `describe`

The first argument to the `describe` function is the name of the test, as a
string.

The second argument is an object, which should contain the key `tests`. The
value of `tests` is an array containing invocations of the `it` function.

Unlike in Jasmine, the second argument to `describe` is not a function!  You
can't drop arbitrary javascript code inside a describe call--that noise will
not parse.

### Using `it` and `expect`

The `it` function works pretty much like Jasmine's version. It takes two
arguments: a string spelling out the behavior that this test confirms, and a
function that performs the test.

An important difference is that the test function *returns* its expectation;
unlike in Jasmine, just calling `expect` without returning the result won't
have an effect.

### Supplying contexts

The object you pass to `describe` can include an additional key: `context`. The
value of `context` is a function that returns whatever value you want provided
to your test functions.

````javascript
var J = require('./jazzman');

module.exports = J.describe('a test suite!', {
  context: function() {
    return {
      makesIt: 'nice',
      playsIt: 'clean'
    };
  },

  tests: [

    J.it('makes it nice', function(context) {
      return J.expect(context.makesIt).toEqual('nice');
    }),

    J.it('plays it clean', function(context) {
      return J.expect(context.playsIt).toEqual('clean');
    })

  ]
});
````

All the `it` functions are passed the result of the context function. (The
context function gets called fresh for each `it` block.)

### Nested describes

Anywhere you can put an `it` invocation, you can put a `describe` invocation
instead. This allows you to create nested contexts, which are useful for
describing different scenarios in which your code behaves differently.

The context function for a nested describe is passed the context from its
parent describe, which you can use to build your subcontext.

````javascript
var J = require('./jazzman');

module.exports = J.describe('Jazzman', {
  context: function() {
    return {
      jazzmanCan: 'play it clean'
    };
  },

  tests: [

    J.it('plays it clean', function(context) {
      return J.expect(context.jazzmanCan).toEqual('play it clean');
    }),

    J.describe('when the jazzman\'s testifyin', {
      context: function(context) {
        context.jazzmanCan += ' and sing you into paradise';
        return context;
      },

      tests: [
        J.it('can sing you into paradise', function(context) {
          return [
            J.expect(context.jazzmanCan).toEqual('play it clean and sing you into paradise'),
          ];
        }
      ]
    }),

    J.describe('when the jazzman\'s signifyin', {
      context: function(context) {
        context.jazzmanCan += ' and cry like a fallen angel';
        return context;
      },

      tests: [
        J.it('can sing you into paradise', function(context) {
          return [
            J.expect(context.jazzmanCan).toEqual('play it clean and cry like a fallen angel'),
          ];
        }
      ]
    })

  ]
});
````

### Running your tests

Tests are run from the command line via node, and the `cli` module. The
arguments to the command are globs indicating the location of test files to
run. For example, if you have jazzman cloned into a subdirectory of your
project:

````bash
$ node ./jazzman/lib/cli/cli.js ./path/to/my/tests/*spec.js
````

You can also focus on a particular describe or line block by supplying a line
number after a colon:

````bash
$ node ./jazzman/lib/cli/cli.js ./path/to/my/tests/focus_spec.js:111
````
