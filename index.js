"use strict";

function Requestor($) {
  this.$    = $;
  this.host = null;
  this.port = 0;
}

Requestor.prototype.newDuplex = function (opts) {
  var $        = this.$;
  var reqs     = $.copy({}, opts);

  reqs.host    = opts.host || this.host;
  reqs.port    = opts.port || this.port;
  reqs.headers = {
    'Transfer-Encoding': 'chunked',
  };

  var duplex  = $.future();
  var request = $.httpRequest(reqs, function (res) {

    // handle http error codes as error events
    if (res.statusCode >= 400) {
      var error = new Error('RPC Failure: ' + res.statusCode);

      error.code = res.statusCode;

      duplex.emit('error', error, res);

      // abort setting the readable stream if there is an error
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

Requestor.NewFromServer = function (port, host) {
  var reqr = this.New();

  reqr.host = host;
  reqr.port = port;

  return reqr;
};

function copy(into, from) {
  Object.keys(from).forEach(function (key) {
    into[key] = from[key];
  });
  return into;
}

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
    },
    copy: {
      value: copy
    }
  };
  return inject(deps);
}

module.exports = function INIT(deps) {
  if (typeof deps === 'object') return inject(deps);
  else if (deps === undefined)  return defaults();
  else                          throw new Error('injection error');
};
