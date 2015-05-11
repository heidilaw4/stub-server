function Deferred(){
    this.callbacks = [];
    this.resolved = false;
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
    },

    resolve: function(data){
        this.resolved = true;
        this.response = data;
        this.callbacks.forEach(function (callback) {
            callback(data);
        });
        return this;
    }
};

module.exports = Deferred;
