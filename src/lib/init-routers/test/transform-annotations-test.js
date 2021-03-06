
const assert = require('assert');
const proxyquire = require('proxyquire').noPreserveCache();
const transformer = require('../transform-annotation');
const decorators = require('../../decorators/router');

describe('Transform Annotations', function() {


  it('Will transform class metadata', done => {

    const {
      endpoint, get, post, getMetaDataByClass,
    } = decorators;


    // this is to simply fire the
    // event decorator.router.endpoint
    @endpoint('/meow')
    class Stuff {

      @get('/beep')
      @post('/beep')
      serveFoo() {

      }

      @get('/guz')
      meep() {

      }

      @post('/guz')
      jeep() {

      }
    }


    const endpointMeta = transformer(getMetaDataByClass(Stuff).metadata);
    //    console.log(JSON.stringify(endpointMeta, null, 2))
    assert.deepEqual(
      endpointMeta,
      {
        'path': '/meow',
        'endpoints': [
          {
            'methods': {
              'get': {
                'path': '/beep',
                'handler': Stuff.prototype.serveFoo,
              },
              'post': {
                'path': '/beep',
                'handler': Stuff.prototype.serveFoo,
              },
            },
          },
          {
            'methods': {
              'get': {
                'path': '/guz',
                'handler': Stuff.prototype.meep,
              },
            },
          },
          // WHATEVS, for now this wasn't the goal as
          // this should be combined with the GET:/guz.
          // TODO: fix later.  This can be left as is
          // because connect_express will treat this all the same
          {
            'methods': {
              'post': {
                'path': '/guz',
                'handler': Stuff.prototype.jeep,
              },
            },
          },
        ],
      }
    );

    done();

  });

});
