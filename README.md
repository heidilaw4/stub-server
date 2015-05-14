Stub server is node.js based server for mocking request. 
Simple configuration format (JSON), responses can be in different files and types.

#Installation

npm i stub-server

#Usage

Like server:

'''javascript
var stubServer = require('stub-server');

stubServer.config('configuration.json');

stubServer.run();
'''

Middleware:

'''javascript
var stubServer = require('stub-server');

stubServer.config('configuration.json');

stubServer.requestHandler(req, res, next);
'''

Other usage examples are [here](https://github.com/semykin/stub-server/tree/master/examples)


#Configuration

config  - method that configure stub server with server params and stubs. It can be a string value (path to configuration JSON file) and a js object.

config.server - configuration for node.js server, that will be started.

    port - port for stub server, default 9000
    
config.stub - array with requests. 

Stub configuration:

    request - request path [required]
    response - response for this stub, can be a string, JSON, object, path to file [required]
    file (true/false) - if it's true, and response is path to file, stub server return response file data with correct mime type.
    
    
    

#Contributing


#License

