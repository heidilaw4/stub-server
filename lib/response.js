function Response() {
    this.statusCode = 200;
    this.headers = [];
    this.contentType = 'text/html';
    this.body = '';
//    TODO: add cookies
}

module.exports = Response;
