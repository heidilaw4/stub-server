var stubServer = require('./../index');

stubServer.config({
    stubs: 'examples/config.json',
    server: {
        port: 9000
    }
});

stubServer.run();

//TODO: add log config
