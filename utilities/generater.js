var fs = require('fs');
var pdf = require('html-pdf');
var options = {
    format: 'A4',
    border: {
        top: "0",  // default is 0, units: mm, cm, in, px
        right: "2cm",
        bottom: "0",
        left: "2cm"
    },
    orientation: 'portrait',
    header: {
        height: '25mm'
    },
    footer: {
        height: '25mm'
    },
    childProcessOptions: {
        detached: true
    }
};
 
const logger = require('./initLogger');
const templateRegistry = require('./templateRegistry');
const replaceStrings = require('./replaceString');

//get template from source 
const getTemplate = (dataObject) => {
    try {
        logger.logger_info.info('[From generater.js] getTemplate() executed');
        logger.logger_debug.debug('[From generater.js] getTemplate() - type:', dataObject.type);
        return templateRegistry.fetchTemplate(dataObject);
    }
    catch (err) {
        logger.logger_error.error('[From generater.js] getTemplate() -', err, '\n');
        throw err;
    }
}

// function to generate html template using data object
const generateTemplate = (dataObject) => {
    try {
        logger.logger_info.info('[From generater.js] generateTemplate() executed');
        logger.logger_debug.debug('[From generater.js] generateTemplate() executed');
        logger.logger_access.info('[From generater.js] generateTemplate() accessed');
        let createTemplateResponse = replaceStrings(getTemplate(dataObject), dataObject);
        // return the template html string for the corresponding data object
        return createTemplateResponse;
    }
    catch (err) {
        logger.logger_error.error('[From generater.js] generateTemplate() -', err, '\n');
        throw err;
    }
}

const appendToTemplate = (template, dataObject, appendData) => {
    try {
        logger.logger_info.info('[From generater.js] appendToTemplate() executed');
        logger.logger_debug.debug('[From generater.js] appendToTemplate() executed');        
        logger.logger_access.info('[From generater.js] appendToTemplate() accessed');
        let createTemplateResponse = replaceStrings(template, dataObject, appendData);
        // return the template html string for the corresponding data object
        return createTemplateResponse;
    }
    catch (err) {
        logger.logger_error.error('[From generater.js] appendToTemplate() -', err, '\n');
        throw err;
    }
};

const renderPdfAndDownload = dataObject => {
    try {
        logger.logger_debug.debug('[From generater.js] renderPdfAndDownload executed');

        if (dataObject.config.substitution) {
            // generate template after substituting the variables
            dataObject.templateData = generateTemplate(dataObject);
            dataObject.templateData = dataObject.templateData.replace('\n', '');
        }
        if (dataObject.config.append) {
            dataObject.templateData = appendToTemplate(dataObject.templateData, dataObject, dataObject.append);
        }
        return new Promise((resolve, reject) => {
            pdf.create(dataObject.templateData, options).toFile('./out.pdf', (err, res) => {
                if(err) {
                    reject(err)
                }
                console.log('./out.pdf');
                resolve({result: 'success'});
            });
        });
    }
    catch (err) {
        logger.logger_error.error('[From generater.js] renderPdfAndDownload() - ', err, '\n');
        throw err;
    }
}

const renderPdfAndUpload = dataObject => {
    try {
        logger.logger_debug.debug('[From generater.js] renderPdfAndUpload executed');

        if (dataObject.config.substitution) {
            // generate template after substituting the variables
            dataObject.templateData = generateTemplate(dataObject);
            dataObject.templateData = dataObject.templateData.replace('\n', '');
        }
        if (dataObject.config.append) {
            dataObject.templateData = appendToTemplate(dataObject.templateData, dataObject, dataObject.append);
        }
        return new Promise((resolve, reject) => {
            pdf.create(dataObject.templateData, options).toStream(function(err, stream){
                if(err) {
                    reject(err)
                }
                console.log('./out.pdf');
                resolve({result: 'success'});
                stream.pipe(fs.createWriteStream('./foo.pdf'));
            });
        });
    }
    catch (err) {
        logger.logger_error.error('[From generater.js] renderPdfAndUpload() - ', err, '\n');
        throw err;
    }
}

module.exports = {
    generateTemplate,
    appendToTemplate,
    renderPdfAndUpload,
    renderPdfAndDownload
};