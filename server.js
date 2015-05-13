var http = require('http'),
    configuration = require('./configuration'),
    Router = require('./router'),
    _ = require('underscore'),
    log = require('./logger');

exports.run = function () {
    configuration.getConfig().done(function (config) {
        http.createServer(function (req, res) {
            var router = new Router(req, res);
            router.getResponse()
                    .done(function (stub) {
                        if(stub) {
                            res.writeHead(stub.statusCode, stub.contentType);
                            stub.headers.forEach(function (header) {
                                res.setHeader(header.name, header.value);
                            });
                            res.end(stub.body);
                        }
                    })
                    .failed(function () {

                    });
        }).listen(config.server.port || 9000);
        log.info('Server started at port: %d;', config.server.port);
    });
};

exports.stop = function (callback) {
    http.close(callback || _.noop);
};