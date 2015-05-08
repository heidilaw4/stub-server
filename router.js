exports.getResponse = function (req) {
    return {
        status: 200,
        contentType: 'text/plain',
        body: 'I\'m awesome response body'
    }
};