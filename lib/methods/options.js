var util = require('util'),
    Method = require('./method'),
    _ = require('underscore');

function Options(req) {
    Method.call(this, req);
}

util.inherits(Options, Method);

_.extend(Options.prototype, {

});
module.exports = Options;
