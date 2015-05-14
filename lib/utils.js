String.prototype.ignoreCase = function (string) {
        return this.toUpperCase() === string.toString().toUpperCase();
};