const process = require('./process');
const logger = require('./initLogger');

// Function to generate and call process based on tag
const generateFunctionAndCall = (functionType, tag, dataObject) => {
    try {
        let functionName = 'process_' + functionType;
        logger('debug', '[From utilities/processRegistry.js] generateFunctionAndCall() - functionType:' + functionType + '\nfunctionName:' + functionName); 
        return process[functionName](tag, dataObject);
    }
    catch(err) {
        logger('error', '[From utilities/processorRegistry.js] generateFunctionAndCall() -' + err + '\n');
        throw err;
    }
};

const dataAppender = (appendData) => {
    try {
        logger('debug', '[From utilities/processRegistry.js] dataAppender() executed');    
        return process.process_append(appendData);
    }
    catch(err) {
        logger('error', '[From utilities/processorRegistry.js] dataAppender() -' + err + '\n');
        throw err;
    }
};

module.exports = { generateFunctionAndCall, dataAppender };