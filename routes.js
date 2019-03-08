const express = require('express');
const router = express.Router();

const generater = require('./utilities/generater');
const logger = require('./utilities/initLogger');

// respond with return data when post request is made
router.post('/render', (req, res) => {
    dataObject = req.body;
    responseDataObject = require('./index')(req.body)
    console.log("recieved request")
    // let responseTemplate = JSON.stringify(responseDataObject.templateData);
    // responseDataObject.templateData = responseTemplate;
    res.send(responseDataObject);
});

router.post('/download-pdf', (req, res) => {
    // dataObject = req.body;
    generater.renderPdfAndDownload(req.body)
        .then(result => {
            // logger.logDebug.debug('[from routes.js] post(/upload)\nResult:', result); 
            res.send(result)
        })
        .catch(error => {
            // logger.logError.error('[from routes.js] post(/upload)\n', error);
            res.status(500).send(error);
        })
})

router.post('/upload-pdf', (req, res) => {
    // dataObject = req.body;
    generater.renderPdfAndUpload(req.body)
        .then(result => {
            // logger.logDebug.debug('[from routes.js] post(/upload)\nResult:', result); 
            res.send(result)
        })
        .catch(error => {
            // logger.logError.error('[from routes.js] post(/upload)\n', error);
            res.status(500).send(error);
        })
})

module.exports = router;
