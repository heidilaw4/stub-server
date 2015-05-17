var should = require('should'),
        configuration = require('./../lib/configuration'),
        Deferred = require('./../lib/deferred'),
        MESSAGES = require('./../lib/MESSAGES');

describe('Configuration', function () {

    var config = function (conf) {
        return configuration.setConfig.bind(null, conf);
    };

    describe('should throw exception', function () {

        it('when no configuration object or has no stub property', function () {

            config().should.throw(MESSAGES.ERRORS.WRONG_CONFIGURATION);
            config({}).should.throw(MESSAGES.ERRORS.WRONG_CONFIGURATION);
            config({ stubs: true }).should.not.throw(MESSAGES.ERRORS.WRONG_CONFIGURATION);
        });

        it('when incorrect stubs type', function () {
            config({ stubs: true }).should.throw(MESSAGES.ERRORS.WRONG_STUB_TYPE);
            config({ stubs: 1 }).should.throw(MESSAGES.ERRORS.WRONG_STUB_TYPE);
            config({ stubs: [] }).should.not.throw(MESSAGES.ERRORS.WRONG_STUB_TYPE);
            config({ stubs: ' ' }).should.not.throw(MESSAGES.ERRORS.WRONG_STUB_TYPE);
            config({ stubs: {} }).should.throw(MESSAGES.ERRORS.WRONG_STUB_TYPE);
        });

        describe('If stubs property is string', function () {

            it('should throw exception if no such file', function () {
                config({ stubs: 'wrong-file-config.json' }).should.throw(MESSAGES.ERRORS.WRONG_CONFIGURATION_PATH);
                config({ stubs: 'tests/configs/empty-config.json' }).should.not.throw(MESSAGES.ERRORS.WRONG_CONFIGURATION_PATH);
            });

            it('if file format is not JSON - throw an exception', function () {
                config({ stubs: 'tests/configs/empty-config.json' }).should.throw(MESSAGES.ERRORS.INVALID_STUB_JSON_FORMAT);
                config({ stubs: 'tests/configs/empty-json-config.json' }).should.not.throw(MESSAGES.ERRORS.INVALID_STUB_JSON_FORMAT);
            });

        });

    });

    it('get config should return deferred object', function () {
        configuration.getConfig().should.be.instanceOf(Deferred);
    });

});