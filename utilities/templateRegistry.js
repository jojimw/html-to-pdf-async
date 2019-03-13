const { process_template } = require('./process');
const logger = require('./initLogger');

// Function to fetch template based on type and version
const fetchTemplate = (dataObject) => {
    try {
        let templateFile = process_template(dataObject);
        logger('debug', '[From utilities/templateRegistry.js] fetchTemplate() - type:' + dataObject.type + `\ntemplateName: ${dataObject.type}Template`);    
        return templateFile;
    }
    catch(err) {
        logger('error', '[From utilities/templateRegistry.js] fetchTemplate() -' + err + '\n');
        throw err;
    }
}

module.exports = { fetchTemplate };