var util = require('util'),
    Method = require('./method'),
    _ = require('underscore');

function Get(req) {
    Method.call(this, req);
}

util.inherits(Get, Method);

_.extend(Get.prototype, {

});
module.exports = Get;