var should = require('should'),
        configuration = require('./../lib/configuration'),
        Deferred = require('./../lib/deferred');

describe('Configuration', function () {

    var config = function (conf) {
        return configuration.setConfig.bind(null, conf);
    };

    describe('should throw exception', function () {

        it('when no configuration object or has no stub property', function () {

            config().should.throw('Wrong configuration');
            config({}).should.throw('Wrong configuration');
            config({ stubs: true }).should.not.throw('Wrong configuration');
        });

        it('when incorrect stubs type', function () {
            config({ stubs: true }).should.throw('Wrong stubs type');
            config({ stubs: 1 }).should.throw('Wrong stubs type');
            config({ stubs: [] }).should.not.throw('Wrong stubs type');
            config({ stubs: ' ' }).should.not.throw('Wrong stubs type');
            config({ stubs: {} }).should.throw('Wrong stubs type');
        });

        describe('If stubs property is string', function () {

            it('should throw exception if no such file', function () {
                config({ stubs: 'wrong-file-config.json' }).should.throw('Wrong path to stubs configuration');
                config({ stubs: 'tests/configs/empty-config.json' }).should.not.throw('Wrong path to stubs configuration');
            });

            it('if file format is not JSON - throw an exception', function () {
                config({ stubs: 'tests/configs/empty-config.json' }).should.throw('Invalid JSON format for stubs configuration');
                config({ stubs: 'tests/configs/empty-json-config.json' }).should.not.throw('Invalid JSON format for stubs configuration');
            });

        });

    });

    it('get config should return deferred object', function () {
        configuration.getConfig().should.be.instanceOf(Deferred);
    });

});