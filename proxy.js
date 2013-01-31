var connect = require('connect');
var port    = process.env.port || 3535;
var needle  = require('needle');

var app = connect()
    .use(connect.query())
    .use(connect.bodyParser())
    .use(function (req, res) {
        if (!req.query.url || req.body.length === 0) {
            res.statusCode = 500;
            res.end();
            return;
        }

        needle.post('http://' + req.query.url, {
            image: req.body.image,
            name: req.body.name
        }, {
            multipart: true
        }, function (err, response, body) {
            if (err) {
                res.statusCode = 500;
                res.end();
                return;
            }

            res.writeHead(200, {
                'Content-Type': 'application/json'
            });
            res.write(body);
            res.end();
        });
    })
    .listen(port);