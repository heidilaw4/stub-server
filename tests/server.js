var should = require('should'),
        server = require('./../lib/server'),
        sinon = require('sinon'),
        configuration = require('./../lib/configuration'),
        Deferred = require('./../lib/deferred'),
        http = require('http');


describe('Server', function () {

    var createServerStub,
        getConfigStub,
        createServerVal;

    beforeEach(function () {
        getConfigStub = sinon.stub(configuration, 'getConfig', function () {
            return new Deferred().resolve({
                server: {
                    port: 9001
                }
            });
        });
        createServerVal = {
            listen: function () {}
        };

        createServerStub = sinon.stub(http, 'createServer', function () {
            return createServerVal;
        });
    });

    afterEach(function () {
        createServerStub.restore();
        getConfigStub.restore();
    });

    it('should get configuration when called', function () {
        server.run();
        getConfigStub.called.should.be.equal(true);
    });

    xdescribe('has custom request handler', function () {

        xit('should call next function from custom request handler if no stub', function () {

        });

    });

    xdescribe('should write params to response', function () {
        xit('headers from stub configuration', function () {

        });

        xit('write body response from stub', function () {

        });

        xit('write correct response type', function () {

        });

        xit('write correct response code', function () {

        });
    });

    it('should run http server, when method run was called with correct configuration', function () {
        server.run();
        createServerStub.called.should.be.equal(true);
    });

    it('should run server an configuration port', function () {
        var listenSpy = sinon.spy(createServerVal, 'listen');
        server.run();
        listenSpy.calledWith(9001).should.be.equal(true);
    });

    it('should run server an 9000 port if no configuration', function () {
        var listenSpy = sinon.spy(createServerVal, 'listen');
        getConfigStub.restore();
        getConfigStub = sinon.stub(configuration, 'getConfig', function () {
            return new Deferred().resolve({
                server: {}
            });
        });
        server.run();
        listenSpy.calledWith(9000).should.be.equal(true);
    });

    xit('should return 400 error if no request handler and no stub', function () {

    });

    xit('should return response from stub if it fits', function () {

    });

});