# lib-stream-http

> create a duplex stream representing the http connection

## install

```bash
npm install --save lib-stream-http
```

## usage

```javascript
var Requestor = require('lib-stream-http')();
var requestor = Requestor.New();

var opts = {
  host: 'myhost.example.com',
  path: '/somet/path',
}

var duplex = requestor.newDuplex(opts);

// generate error on http status >= 400
// you should still consume the res
duplex.on('error', function (err, res) {
  console.error('error', err);
  res.pipe(process.stderr);
});

inStream.pipe(duplex).pipe(outStream);
```

## limitations

- does not handle `3xx` status codes

## see also

- [lib-http-rpc](https://npmjs.org/package/lib-http-rpc)
- [lib-http-api](https://npmjs.org/package/lib-http-api)
- [lib-stream-liquify](https://npmjs.org/package/lib-stream-liquify)
- [lib-stream-solidify](https://npmjs.org/package/lib-stream-solidify)
