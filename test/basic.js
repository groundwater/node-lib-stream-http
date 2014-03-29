var test = require('tap').test;

var Requestor = require('../index.js')();
var liquify   = require('lib-stream-liquify');
var solidify  = require('lib-stream-solidify');

test("happy path", function (t) {
  var requestor = Requestor.New();
  var http = require('http');
  var serv = http.createServer(function (req, res) {
    req.pipe(res);
  })

  serv.listen(8080);

  var opts = {
    port: 8080,
    headers: {
      'Transfer-Encoding': 'chunked'
    }
  };

  var duplex = requestor.newDuplex(opts);

  liquify({a: 'A'}).pipe(duplex).pipe(solidify()).json(function (_, json) {
    t.deepEqual(json, {a: 'A'});
    t.end();

    serv.close();
  });
});

test("no connect error", function (t) {
  t.plan(2);

  var requestor = Requestor.New();

  var opts = {
    port: 8080,
    headers: {
      'Transfer-Encoding': 'chunked'
    }
  };

  var duplex = requestor.newDuplex(opts);
  duplex.on('error', function (err) {
    t.equal(err.code, 'ECONNREFUSED');
    t.ok(err);
  });
  duplex.end();
});
