const log4js = require('log4js');

// Configure logs
log4js.configure({
    appenders: {
        multi: { type: 'multiFile', base: 'logs/', property: 'categoryName', extension: '.log' }
    },
    categories: { default: { appenders: ['multi'], level: 'debug' } }
});

// Initialize the loggers for use
const loggerObject = {
    logger_info: log4js.getLogger('info'),
    logger_error: log4js.getLogger('error'),
    logger_debug: log4js.getLogger('debug'),
    logger_access: log4js.getLogger('access')
};
    
module.exports = loggerObject;