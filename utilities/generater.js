const pdf = require('html-pdf');
const mime = require('mime');
const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const logger = require('./initLogger');
const templateRegistry = require('./templateRegistry');
const replaceStrings = require('./replaceString');
const { awsAccessKeyId, awsSecretAccessKey, awsBucketUrl } = require('../env-config')

AWS.config.update({
    accessKeyId: awsAccessKeyId,
    secretAccessKey: awsSecretAccessKey
});
const s3 = new AWS.S3();

const htmlPdfOptions = {
    format: 'A4',
    border: {
        top: "0",  // default is 0, units: mm, cm, in, px
        right: "2cm",
        bottom: "0",
        left: "2cm"
    },
    orientation: 'portrait',
    header: {
        height: '2cm'
    },
    footer: {
        height: '2cm'
    },
    childProcessOptions: {
        detached: true
    },
    type: "pdf"
};

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

const generateOutFileName = () => `${uuidv4()}.pdf`;

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

        // generate pdf and download
        return new Promise((resolve, reject) => {
            const outFile = generateOutFileName();
            pdf.create(dataObject.templateData, htmlPdfOptions).toFile(`./${outFile}`, (err, res) => {
                if(err) {
                    logger.logger_error.error('[From generater.js] renderPdfAndDownload() - \nfile error:', err, '\n');
                    reject(err)
                }
                resolve({result: `file downloaded ${outFile}`});
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

        // generate pdf and upload to s3
        return new Promise((resolve, reject) => {
            pdf.create(dataObject.templateData, htmlPdfOptions).toStream((err, stream) => {
                if(err) {
                    logger.logger_error.error('[from generater.js] renderPdfAndUpload() \nstream error:', err);
                    reject(err);
                    return;
                }
                const outFile = generateOutFileName();
                const data = {
                    Bucket: awsBucketUrl,
                    Key: outFile,
                    Body: stream,
                    ContentType: mime.getType(outFile)
                };

                // Upload to aws s3 bucket
                s3.upload(data, (err, res) => {
                    if (err) {
                        logger.logger_error.error('[from generater.js] renderPdfAndUpload() \ns3 upload error:', err);
                        reject(err);
                        return;
                    }
                    
                    // Upload success
                    if (res) {
                        logger.logger_debug.debug('[from generater.js] renderPdfAndUpload() \ns3 upload response:', res);
                        resolve({
                            "uploadLink": res.Location,
                        });
                    }
                });
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