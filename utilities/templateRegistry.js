const process = require('./process');
const logger = require('../initLogger');

// Function to fetch template based on type and version
const fetchTemplate = (dataObject) => {
    try {
        // let templateName = type + 'Template';
        let templateFile =  process.process_template(dataObject);
        logger.logger_debug.debug('[From utilities/templateRegistry.js] fetchTemplate() - type:', dataObject.type, `\ntemplateName: ${dataObject.type}Template`);    
        return templateFile;
    }
    catch(err) {
        logger.logger_error.error('[From utilities/templateRegistry.js] fetchTemplate() -', err, '\n');
        throw err;
    }
}

module.exports = { fetchTemplate };