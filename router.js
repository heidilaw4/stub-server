var configuration = require('./configuration'),
    deferred = require('./deferred'),
    url = require('url'),
    _ = require('underscore'),
    fs = require('fs'),
    mime = require('mime');

var stubs,
    stub,
    response = {},
    params;

exports.getResponse = function (req) {
    var d = new deferred.Deferred(),
        parsedUrl = url.parse(req.url, true);
    params = {
        url: parsedUrl.pathname,
        method: req.method.toLowerCase(),
        query: parsedUrl.query
    };

    configuration.getConfig().done(function (config) {
        stubs = config.stubs;
        d.resolve(getResponse());
    });
    return d;
};


function getResponse() {
    response = {};
    stub = stubs[params.url];
    if(stub) {
        response.status = params.status || 200;
        response.contentType = params.contentType || 'application/json';
        if(_.isArray(stubs[params.url])) {
            //TODO: find proper response
        } else if (_.isObject(stub)) {
            compareRequestAndStub();
        } else {
            response.body = stub;
        }

    } else {
        getErrorResponse();
    }
    return response;
}


function getResponseBody() {
    if(stub.file) {
        response.body = fs.readFileSync(stub.response);
        response.contentType = mime.lookup(stub.response);
    } else {
        if(_.isObject(stub.response)) {
            try {
                response.body = JSON.stringify(stub.response);
            } catch(e) {
                response = getErrorResponse("Wrong json format");
            }
        } else {
            response.body = stub.response;
        }
    }
}

function getErrorResponse(msg, status){
    response = {
        status: status || 400,
        contentType: 'text/plain',
        body: msg
    }
}

function compareRequestAndStub() {
    var correctQueries = false;
    if(stub.method && params.method !== stub.method.toLowerCase()){
        getErrorResponse("Incorrect request method");
    } else {
        if(!_.isEmpty(params.query)) {
            _.every(params.query, function (value, key) {
                if(stub.query[key] === true) {
                    correctQueries = true;
                } else {
                    correctQueries = stub.query[key] === value;
                }
                return correctQueries;
            });
            correctQueries ? getResponseBody() : getErrorResponse("Incorrect query params");
        } else {
            getResponseBody()
        }
    }
}