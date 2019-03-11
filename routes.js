const express = require('express');
const router = express.Router();

const generater = require('./utilities/generater');
const logger = require('./utilities/initLogger');

// respond with return data when post request is made
router.post('/render', (req, res) => {
    dataObject = req.body;
    responseDataObject = require('./index')(req.body)
    res.send(responseDataObject);
});

router.post('/download-pdf', (req, res) => {
    generater.renderPdfAndDownload(req.body)
        .then(result => {
            logger.logger_info.info('[from routes.js] post(/download-pdf)\nResult:', result);
            logger.logger_debug.debug('[from routes.js] post(/download-pdf)\nResult:', result); 
            res.send(result);
        })
        .catch(error => {
            // logger.logError.error('[from routes.js] post(/upload)\n', error);
            logger.logger_error.error('[from routes.js] post(/download-pdf)\n', error, '\n');
            res.status(500).send(error);
        })
})

router.post('/upload-pdf', (req, res) => {
    generater.renderPdfAndUpload(req.body)
        .then(result => {
            logger.logger_info.info('[from routes.js] post(/upload-pdf)\nResult:', result);
            logger.logger_debug.debug('[from routes.js] post(/upload-pdf)\nResult:', result);
            res.send(result);
        })
        .catch(error => {
            logger.logger_error.error('[from routes.js] post(/upload-pdf)\n', error, '\n');
            res.status(500).send(error);
        })
})

module.exports = router;
