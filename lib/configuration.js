var fs = require('fs');
var _ = require('underscore');
var server = {};
var stubs = {};
var Deferred = require('./deferred');
var deferred = new Deferred();


exports.setConfig = function(config) {
    var stubsPath;
    if(!config || !config.stubs) {
        throw new Error("Wrong configuration");
    }

    server = config.server || {};

    if(typeof config.stubs === 'string') {

        if(!fs.existsSync(config.stubs)) {
            throw new Error("Wrong path to stubs configuration");
        }

        try {
            stubsPath = fs.readFileSync(config.stubs);
        } catch(e) {
            throw new Error("Error while reading file: " + config.stubs);
        }

        try {
            stubs = JSON.parse(stubsPath);
        } catch (e) {
            throw new Error("Invalid JSON format for stubs configuration");
        }

    } else if(_.isArray(config.stubs)) {
        stubs = config.stubs;

    } else {
        throw new Error("Wrong stubs type");
    }

    deferred.resolve({
        server: server,
        stubs: stubs
    });

};

exports.getConfig = function () {
    return deferred;
};
