var stubServer = require('./../index');

stubServer.config({
    stubs: 'config.json',
    server: {
        port: 9000
    }
});

stubServer.run();