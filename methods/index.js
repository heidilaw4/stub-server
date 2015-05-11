var Get = require('./get'),
    Post = require('./post'),
    Put = require('./put'),
    Delete = require('./delete');

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
            throw Error('Method ' + methodName + ' is not supported');
    }
}
module.exports = Method;