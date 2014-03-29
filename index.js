"use strict";

function Requestor($) {
  this.$ = $;
}

Requestor.prototype.newDuplex = function (opts) {
  var $ = this.$;

  var duplex  = $.future();
  var request = $.httpRequest(opts, function (res) {

    // handle http error codes as error events
    if (res.statusCode >= 400) {
      var error = new Error('RPC Failure: ' + res.statusCode);

      error.code = res.statusCode;

      duplex.emit('error', error, res);

      return;
    }

    duplex.setReadable(res);
  });

  // forward errors from http stream to duplex
  request.on('error', function (err) {
    duplex.emit('error', err);
  });

  duplex.setWritable(request);

  return duplex;
};

Requestor.New = function () {
  return new Requestor(this);
};

function inject(deps) {
  return Object.create(Requestor, deps);
}

function defaults() {
  var deps = {
    httpRequest: {
      value: require('http').request
    },
    future: {
      value: require('lib-stream-future')
    }
  };
  return inject(deps);
}

module.exports = function INIT(deps) {
  if (typeof deps === 'object') return inject(deps);
  else if (deps === undefined)  return defaults();
  else                          throw new Error('injection error');
};
