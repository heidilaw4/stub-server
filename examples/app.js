var stubServer = require('./../index');

stubServer.config({
    stubs: 'examples/config.json',
    server: {
        port: 9000
    }
});

stubServer.run();

//TODO: one request with data and no strict (check the data)
//TODO: same url for post and get
//TODO: add log config
