var http = require('http'),
    configuration = require('./configuration'),
    router = require('./router');

exports.run = function () {
    configuration.getConfig().done(function (config) {
        http.createServer(function (req, res) {
            var response = router.getResponse(req);
            res.writeHead(response.status, response.contentType);
            res.end(response.body);
        }).listen(config.server.port || 9000);
        console.log('Server started at port: %d;', config.server.port);
    });
};