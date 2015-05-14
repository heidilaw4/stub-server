var util = require('util'),
        Method = require('./method'),
        Deferred = require('./../deferred'),
        _ = require('underscore');

function Post(req) {
    Method.call(this, req);
}

util.inherits(Post, Method);

_.extend(Post.prototype, {
    getRequestData: function (req) {
        var data = '',
            deferred = new Deferred();
        req.on('data', function(chunk) {
            data += chunk;
        });
        req.on('end', function() {
            deferred.resolve(data);
        });

        return deferred;
    }
});
module.exports = Post;