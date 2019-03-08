const processorRegistry = require('../utilities/processorRegistry');
const logger = require('../initLogger');
const regExp = require('../regExps/regExp');

let currentTag, replaceData;

// Replace the tags with corresponding value from dataObject
const replaceStrings = (template, dataObject, appendData = null) => {
    try {
        if (appendData) {
            logger.logger_info.info('[From replaceStrings/replaceStrings.js] replaceStrings() executed');
            replaceData = processorRegistry.dataAppender(appendData);
            template = template.replace(replaceData[0], replaceData[1]);
        }
        else {
            logger.logger_info.info('[From replaceStrings/replaceStrings.js] replaceStrings() executed');
            let re = regExp.templateRegExp;
            while (currentTag = re.exec(template)) {
                replaceData = processorRegistry.generateFunctionAndCall(currentTag[1], currentTag, dataObject);
                
                // The value in replaceData[0] will be replaced by the new value in replaceData[1]
                template = template.replace(replaceData[0], replaceData[1]);
                re.lastIndex = 0;
            }
            if (!dataObject.config.append) {
                template = template.replace('{{appendData}}', '');
            }
        }
        return template;
    }
    catch (err) {
        logger.logger_error.error('[From replaceStrings/replaceStrings.js] replaceStrings() -', err, '\n');
        throw err;
    }
}

module.exports = replaceStrings;