var fs = require('fs'),
    _ = require('underscore'),
    Deferred = require('./deferred'),
    MESSAGES = require('./../lib/MESSAGES');

var server = {},
    stubs = {},
    deferred = new Deferred();


exports.setConfig = function(config) {
    var stubsPath;
    if(!config || !config.stubs) {
        throw new Error(MESSAGES.ERRORS.WRONG_CONFIGURATION);
    }

    server = config.server || {};

    if(typeof config.stubs === 'string') {

        if(!fs.existsSync(config.stubs)) {
            throw new Error(MESSAGES.ERRORS.WRONG_CONFIGURATION_PATH);
        }

        try {
            stubsPath = fs.readFileSync(config.stubs);
        } catch(e) {
            throw new Error(MESSAGES.ERRORS.ERROR_WHILE_READING_FILE + config.stubs);
        }

        try {
            stubs = JSON.parse(stubsPath);
        } catch (e) {
            throw new Error(MESSAGES.ERRORS.INVALID_STUB_JSON_FORMAT);
        }

    } else if(_.isArray(config.stubs)) {
        stubs = config.stubs;

    } else {
        throw new Error(MESSAGES.ERRORS.WRONG_STUB_TYPE);
    }

    deferred.resolve({
        server: server,
        stubs: stubs
    });

};

exports.getConfig = function () {
    return deferred;
};
