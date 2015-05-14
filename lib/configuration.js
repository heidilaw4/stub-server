var fs = require('fs');

var server = {};
var stubs = {};
var Deferred = require('./deferred');
var deferred = new Deferred();

exports.setConfig = function(config) {
    var stubsPath;
//TODO: check all the errors;

    if(!config || !config.stubs) {
        throw Error("Wrong configuration");
    }

    server = config.server || {};

    if(typeof config.stubs === 'string') {

        if(!fs.existsSync(config.stubs)) {
            throw Error("Wrong path to stubs configuration");
        }

        try {
            stubsPath = fs.readFileSync(config.stubs);
        } catch(e) {
            throw Error("Error while reading file: " + config.stubs);
        }

        try {
            stubs = JSON.parse(stubsPath);
        } catch (e) {
            throw Error("Invalid JSON format for stubs configuration");
        }

    } else if(typeof config.stubs === 'object') {
        stubs = config.stubs;

    } else {
        throw Error("Wrong stubs type");
    }

    deferred.resolve({
        server: server,
        stubs: stubs
    });

};

exports.getConfig = function () {
    return deferred;
};