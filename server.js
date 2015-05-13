var http = require('http'),
    configuration = require('./configuration'),
    Router = require('./router'),
    _ = require('underscore'),
    log = require('./logger');

function requestHandler(req, res, next) {
    next = next || _.noop;

    var router = new Router(req, res);
    router.getResponse()
            .done(function (stub) {
                console.log(stub);
                res.writeHead(stub.statusCode, stub.contentType);
                stub.headers.forEach(function (header) {
                    res.setHeader(header.name, header.value);
                });
                res.end(stub.body);
            })
            .failed(function () {
                next();
            });
}

exports.run = function () {
    configuration.getConfig().done(function (config) {
        http.createServer(requestHandler).listen(config.server.port || 9000);
        log.info('Server started at port: %d;', config.server.port || 9000);
    });
};

exports.stop = function (callback) {
    http.close(callback || _.noop);
};

exports.requestHandler = requestHandler;