var config = require('./configuration'),
    server = require('./server');

exports.config = config.setConfig;

exports.run = server.run;