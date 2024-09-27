const httpStatus = require('http-status');
class APIError {
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
        data['message'] = message;
        data['status'] = status;
        return data;
    }
}

module.exports = APIError;
