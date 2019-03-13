const log4js = require('log4js');

// Configure logs
log4js.configure({
    appenders: {
        multi: { type: 'multiFile', base: 'logs/', property: 'categoryName', extension: '.log' }
    },
    categories: { default: { appenders: ['multi'], level: 'debug' } }
});

// Initialize the loggers for use
const logger = (type, message) => {
    switch (type) {
        case 'info': {
            log4js.getLogger('info').info(message)
            break;
        }
        case 'error': {
            log4js.getLogger('error').error(message)
            break;
        }
        case 'debug': {
            log4js.getLogger('debug').debug(message)
            break;
        }
        case 'access': {
            log4js.getLogger('access').info(message)
            break;
        }
        default: {
            break;
        }
    }
}
    
module.exports = logger;