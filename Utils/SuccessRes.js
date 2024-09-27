const httpStatus = require('http-status');
class SuccessRes {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     */
    constructor({
        message,
        data,
        status
    }) {
        let resp={}
        resp['data'] = data;
        resp['message'] = message;
        resp['status'] = status;
        return resp;
    }
}

module.exports = SuccessRes;
