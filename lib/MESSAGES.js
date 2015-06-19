var MESSAGES = {

    ERRORS: {
        WRONG_STUB_TYPE: 'Wrong stubs type',
        WRONG_CONFIGURATION: 'Wrong stubs configuration',
        WRONG_CONFIGURATION_PATH: 'Wrong path to stubs configuration',
        INVALID_STUB_JSON_FORMAT: 'Invalid JSON format for stubs configuration',
        ERROR_WHILE_READING_FILE: 'Error while reading file: ',
        WRONG_JSON_RESPONSE_FORMAT: 'Wrong JSON response format',
        RESPONSE_SHOULD_BE_A_FILE: 'Response should be a file'
    },
    WARN: {
        STUB_RESPONSE_FAILED: 'Stub response for \"%s\" failed',
        NO_APPROPRIATE_STUB_FOR: 'No appropriate stub for %s : %s',
        NO_STUB_WITHOUT_DATA: 'No stub without data  for %s : %s',
        NO_STUB_WITH_SUCH_DATA: 'No stub with such request data  for %s : %s',
        METHOD_IS_NOT_SUPPORTED: 'Method %s is not supported'
    },
    INFO: {
        STUB_RESPONSE_SUCCEED: 'Stub response for \"%s\" succeed',
        SERVER_STARTED_AT_PORT: 'Server started at port: %d;'
    }
};
module.exports = MESSAGES;