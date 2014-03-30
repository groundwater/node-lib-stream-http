var test = require('tap').test;
var http = require('http');
var Requestor = require('../index.js')();
var liquify   = require('lib-stream-liquify');
var solidify  = require('lib-stream-solidify');

test("error events should not pipe", function (t) {
  t.plan(2);

  var requestor = Requestor.New();

  var opts = {
    port: 8080,
    headers: {
      'Transfer-Encoding': 'chunked'
    }
  };

  var serv = http.createServer(function(req, res){
    res.statusCode = 400;
    res.end('ASDF');

    serv.close();
  });

  serv.listen(8080);

  var duplex = requestor.newDuplex(opts);

  duplex.on('error', function (err, res) {
    solidify(res).text(function (err, text) {
      t.equal(text, 'ASDF');
    });
    t.ok(err);
  });

  duplex.on('data', function (data) {
    t.ok(false, "data events should not fire");
  });

  duplex.on('end', function () {
    t.ok(false, "end event should not fire");
  })

  duplex.end();
});
