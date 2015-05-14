function Deferred(){
    this.callbacks = [];
    this.errorCallbacks = [];
    this.resolved = false;
    this.rejected = false;
    this.response = '';
}

Deferred.prototype = {
    done: function(callback){
        if(typeof callback === 'function') {
            this.callbacks.push(callback);
        }
        else throw 'Callback should be a func';

        if(this.resolved) {
            callback(this.response);
        }
        return this;
    },

    resolve: function(data){
        this.resolved = true;
        this.response = data;
        this.callbacks.forEach(function (callback) {
            callback(data);
        });
        return this;
    },

    failed: function(callback) {
        if(typeof callback === 'function') {
            this.errorCallbacks.push(callback);
        }
        else throw 'Callback should be a func';

        if(this.rejected) {
            callback(this.response);
        }
        return this;
    },

    reject: function(data){
        this.rejected = true;
        this.response = data;
        this.errorCallbacks.forEach(function (callback) {
            callback(data);
        });
        return this;
    }
};

module.exports = Deferred;