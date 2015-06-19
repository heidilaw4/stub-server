var http = require('http'),
    configuration = require('./configuration'),
    Router = require('./router'),
    _ = require('underscore'),
    log = require('./logger'),
    MESSAGES = require('./MESSAGES');

function requestHandler(req, res, next) {
    next = next || notFound(res);

    var router = new Router(req, res);
    router.getResponse()
            .done(function (stub) {

                stub.headers.forEach(function (header) {
                    res.setHeader(header.name, header.value);
                });
                res.writeHead(stub.statusCode, stub.contentType);
                res.end(stub.body);

            })
            .failed(function () {
                next();
            });
}

function notFound(res) {
    return function(){
        res.statusCode = 400;
        res.end();
    }
}
exports.run = function () {
    configuration.getConfig().done(function (config) {
        http.createServer(requestHandler).listen(config.server.port || 9000, '0.0.0.0');
        log.info(MESSAGES.INFO.SERVER_STARTED_AT_PORT, config.server.port || 9000);
    });
};

exports.requestHandler = requestHandler;
