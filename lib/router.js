var configuration = require('./configuration'),
    url = require('url'),
    Method = require('./methods/index'),
    Deferred = require('./deferred'),
    _ = require('underscore'),
    qs = require('querystring'),
    log = require('./logger'),
    utils = require('./utils'),
    MESSAGES = require('./MESSAGES');

function Router(req, res) {
    this.req = req;
    configuration.getConfig().done(function (config) {
        this.stubs = config.stubs;
    }.bind(this));
    this.filteredStubs = [];
    this.stubResponse = new Deferred();
    this.parseRequest();
    this.filterStubsByUrlAndMethod();
    this.getAppropriateStub()
            .done(this.getStubResponse.bind(this))
            .failed(function () {
                this.stubResponse.reject();
            }.bind(this));
}

Router.prototype = {
    getResponse: function () {
        return this.stubResponse;
    },

    parseRequest: function () {
        this.url = url.parse(this.req.url, true);
        this.method = new Method(this.req.method, this.req);

        log.info('%s : %s', this.req.method.toUpperCase(), this.url.path);
    },

    getStubResponse: function (stub) {
        this.method.getResponse(stub)
                .done(function (stubResp) {
                    if(stubResp) {
                        this.stubResponse.resolve(stubResp);
                        log.info(MESSAGES.INFO.STUB_RESPONSE_SUCCEED, this.url.path);
                    } else {
                        this.stubResponse.reject();
                        log.warn(MESSAGES.WARN.STUB_RESPONSE_FAILED, this.url.path);
                    }
                }.bind(this))
                .failed(function () {
                    this.stubResponse.reject();
                    log.warn(MESSAGES.WARN.STUB_RESPONSE_FAILED, this.url.path);
                }.bind(this));
    },

    filterStubsByUrlAndMethod: function () {
        this.filteredStubs = _.filter(this.stubs, function (stub) {
            stub.method = stub.method || 'get';
            return this.url.pathname === stub.url && this.req.method.ignoreCase(stub.method);
        }.bind(this));
    },

    getAppropriateStub: function () {
        var deferred = new Deferred();
        if(!this.filteredStubs.length) {
            log.warn(MESSAGES.WARN.NO_APPROPRIATE_STUB_FOR, this.req.method.toUpperCase(), this.url.path);
            deferred.reject();
        } else if(this.filteredStubs.length === 1) {
            var stub = this.filteredStubs[0];
            if(!stub.data || this.req.method.ignoreCase('get')){
                deferred.resolve(stub);
            } else {
                this.method.getRequestData(this.req).done(function (data) {
                    var stub = this.getStubByData(data);
                    if(!stub) {
                        log.warn(MESSAGES.WARN.NO_STUB_WITHOUT_DATA, this.req.method.toUpperCase(), this.url.path);
                        deferred.reject();
                    } else {
                        deferred.resolve(stub);
                    }
                }.bind(this));
            }
        } else {
            this.method.getRequestData(this.req).done(function (data) {
                var stub = this.getStubByData(data);
                if(!stub) {
                    log.warn(MESSAGES.WARN.NO_STUB_WITH_SUCH_DATA, this.req.method.toUpperCase(), this.url.path);
                    deferred.reject();
                } else {
                    deferred.resolve(stub);
                }
            }.bind(this));
        }
        return deferred;
    },

    getStubByData: function (data) {
        var parsedData,
            stub;

        try {
            parsedData = JSON.parse(data);
        } catch(e) {
            parsedData = qs.parse(data);
            parsedData = parsedData.data === '' ? data :  parsedData;
            parsedData = _.isEmpty(parsedData)? undefined: parsedData;
        }

        stub = _.find(this.filteredStubs, function (stub) {
            return _.isEqual(stub.data, parsedData);
        });

        if(!stub && _.isObject(parsedData)) {
            stub = this.getNotStrictStub(parsedData);
        }
        return stub;
    },

    getNotStrictStub: function (data) {
        var priorities = [],
            keys = _.keys(data),
            maxIndex,
            notStrictStubs = _.filter(this.filteredStubs, {strictData: false}),
            maxValue;

        _.each(notStrictStubs, function (stub) {
            var priority = 0;
            if(_.isObject(stub.data)) {
                _.each(keys, function (key) {
                    if(stub.data[key] === data[key]) {
                        priority++;
                        //TODO: check nested objects
                    }
                });
            }
            priorities.push(priority);
        });
        maxValue = Math.max.apply(Math, priorities);
        if(!maxValue) {
            return undefined;
        }
        maxIndex = priorities.indexOf(maxValue);
        return notStrictStubs[maxIndex];
    }
};

module.exports = Router;