const logger = require('./logs/initLogger');
const templateRegistry = require('./utilities/templateRegistry');
const replaceStrings = require('./replaceStrings/replaceString');

//get template from source 
const getTemplate = (dataObject) => {
    try {
        logger.logger_info.info('[From index.js] getTemplate() executed');
        logger.logger_debug.debug('[From index.js] getTemplate() - type:', dataObject.type);
        return templateRegistry.fetchTemplate(dataObject);
    }
    catch (err) {
        logger.logger_error.error('[From index.js] getTemplate() -', err, '\n');
        throw err;
    }
}

// function to generate html template using data object
const generateTemplate = (dataObject) => {
    try {
        logger.logger_info.info('[From index.js] generateTemplate() executed');
        logger.logger_debug.debug('[From index.js] generateTemplate() executed');
        logger.logger_access.info('[From index.js] generateTemplate() accessed');
        let createTemplateResponse = replaceStrings(getTemplate(dataObject), dataObject);
        // return the template html string for the corresponding data object
        return createTemplateResponse;
    }
    catch (err) {
        logger.logger_error.error('[From index.js] generateTemplate() -', err, '\n');
        throw err;
    }
}
const appendToTemplate = (template, dataObject, appendData) => {
    try {

        logger.logger_info.info('[From index.js] appendToTemplate() executed');
        logger.logger_debug.debug('[From index.js] appendToTemplate() executed');        
        logger.logger_access.info('[From index.js] appendToTemplate() accessed');
        let createTemplateResponse = replaceStrings(template, dataObject, appendData);
        // return the template html string for the corresponding data object
        
        return createTemplateResponse;
    }
    catch (err) {
        logger.logger_error.error('[From index.js] appendToTemplate() -', err, '\n');
        throw err;
    }
};

module.exports = {
        generateTemplate,
        appendToTemplate
};