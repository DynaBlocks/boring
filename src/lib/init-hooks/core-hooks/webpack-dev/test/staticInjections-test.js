const assert = require('assert');
const proxyquire = require('proxyquire').noPreserveCache();
const logger = require('boring-logger');

describe('Static Injections', function() {

  let staticInjections;

  beforeEach(() => {
    staticInjections = proxyquire('../staticInjectionMiddleware', {
      'paths': {
        asset_manifest: __dirname +'/test-asset-manifest.json',
      },
    });
  });


  // the "output" should be the same
  // regardlesss of the input
  function assertions(res) {

    staticInjections(res, '/beep/boop.js');
    assert.deepEqual(res.locals.pageInjections.bodyEndScripts, [{src: '/beep/boop.js'}]);
    assert.deepEqual(res.locals.pageInjections.headLinks, [{rel: 'stylesheet', href: '/beep/boop.css'}]);

    res.locals = {};
    staticInjections(res, 'meow/bark.js');
    assert.deepEqual(res.locals.pageInjections.bodyEndScripts, [{src: '/meow/bark.js'}]);

  }

  it('Will read a manifest file and return the proper entrypoint', function(done) {

    const res = {
      locals: {},
    };

    assertions(res);

    done();
  });


  it('Will read webpack object on locals', function(done) {
    const res = {
      locals: {
        webpackStats: {
          toJson: function() {
            return {
              // this object is put on locals by the webpack middleware
              assetsByChunkName: {
                'beep-boop.js': ['/beep/boop.js', '/beep/boop.js.map'],
                'beep-boop.css': ['/beep/boop.css', '/beep/boop.css.map'],
                'meow-bark.js': ['meow/bark.js', 'meow/bark.js.map'],
              },
            };
          },
        },
      },
    };

    assertions(res);

    done();
  });
});
