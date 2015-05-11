var Response = require('./../response'),
    Deferred = require('./../deferred'),
    mime = require('mime'),
    _ = require('underscore'),
    fs = require('fs');

function Method() {
    this.response = new Deferred();
    this.stubResponse = new Response();
    this.stub = {};
}

Method.prototype = {

    getResponse: function (stub) {
        this.stub = stub;
        this.constructResponse();
        return this.response;
    },

    constructResponse: function () {
        this.getStubHeaders();
        this.getStatusCode();
        this.getContentType();
        this.getStubBody().done(function () {
            this.response.resolve(this.stubResponse);
        }.bind(this));
    },

    getStubBody: function () {
        var response = this.stub.response,
            deferred = new Deferred(),
                fileStat;
        if(_.isObject(response)) {
            try {
                this.stubResponse.body = JSON.stringify(response);
                deferred.resolve();
            } catch (e) {
                throw Error('Wrong JSON response format');
            }
        } else if(this.stub.file && _.isString(response)) {
            try {
                fileStat = fs.statSync(this.stub.response);
            } catch (e) {
                throw e;
            }
            if(!fileStat.isFile()) {
                throw Error('Response should be a file');
            }
            fs.readFile(this.stub.response, function (err, data) {
                this.stubResponse.body = data;
                deferred.resolve();
            }.bind(this));
        } else {
            this.stubResponse.body = response;
            deferred.resolve();
        }

        return deferred;
    },

    getStatusCode: function () {
        this.stubResponse.statusCode = this.stub.statusCode || 200;
    },

    getStubHeaders: function () {
        this.stub.headers && this.stub.headers.forEach(this.headers.push.bind(this));
    },

    getContentType: function () {
        if(this.stub.contentType) {
            //TODO: extends stubResponse with stub ?
            this.stubResponse.contentType = this.stub.contentType;
        } else if(this.stub.file) {
            this.stubResponse.contentType = mime.lookup(this.stub.response);
        } else if(_.isString(this.stub.response)){
           this.stubResponse.contentType = 'application/json';
        } else {
            this.stubResponse.contentType = 'text/plain';
        }
    },

    getRequestData: function (stub, req) {
        return new Deferred().resolve('');
    }
};

module.exports = Method;