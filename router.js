var configuration = require('./configuration'),
    url = require('url'),
    Method = require('./methods'),
    Deferred = require('./deferred'),
    _ = require('underscore'),
    qs = require('querystring');

function Router(req, res) {
    this.req = req;
    configuration.getConfig().done(function (config) {
        this.stubs = config.stubs;
    }.bind(this));
    this.filteredStubs = [];
    this.stubResponse = new Deferred();
    this.parseRequest();
    this.filterStubsByUrl();
    this.getAppropriateStub().done(this.getStubResponse.bind(this));
}

Router.prototype = {
    getResponse: function () {
        return this.stubResponse;
    },

    parseRequest: function () {
        this.url = url.parse(this.req.url, true);
        this.method = new Method(this.req.method, this.req);
    },

    getStubResponse: function (stub) {
        this.method.getResponse(stub).done(function (stubResp) {
            this.stubResponse.resolve(stubResp);
        }.bind(this));
    },

    filterStubsByUrl: function () {
        this.filteredStubs = _.filter(this.stubs, {url : this.url.pathname});
    },

    getAppropriateStub: function () {
        var deferred = new Deferred();
        if(!this.filteredStubs.length) {
            throw Error('No appropriate stub');
        } else if(this.filteredStubs.length === 1) {
            deferred.resolve(this.filteredStubs[0]);
        } else {
            this.method.getRequestData(this.req).done(function (data) {
                var stub = this.getStubByData(data);
                if(!stub) {
                    throw Error('No stub with such data');
                }
                deferred.resolve(stub);
            }.bind(this));
        }
        return deferred;
    },

    getStubByData: function (data) {
        var parsedData = qs.parse(data),
            stub;

        parsedData = parsedData.data === '' ? data :  parsedData;
        parsedData = _.isEmpty(parsedData)? undefined: parsedData;

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