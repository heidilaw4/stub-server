var Get = require('./get'),
    Post = require('./post'),
    Put = require('./put'),
    Delete = require('./delete'),
    log = require('./../logger');

function Method(methodName, req) {
    switch (methodName.toLowerCase()) {
        case 'get':
            return new Get(req);
        case 'post':
            return new Post(req);
        case 'put':
            return new Put(req);
        case 'delete':
            return new Delete(req);
        default:
            log.warn('Method ' + methodName + ' is not supported');
    }
}
module.exports = Method;