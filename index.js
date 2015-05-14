var config = require('./lib/configuration'),
    server = require('./lib/server');

exports.config = config.setConfig;

exports.run = server.run;

exports.requestHanlder = server.requestHandler;
