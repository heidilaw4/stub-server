var stubServer = require('./../index');

stubServer.config({
    stubs: 'examples/config.json',
    server: {
        port: 9001
    }
});

stubServer.run();

//TODO: add log config