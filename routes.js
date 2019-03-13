const express = require('express');
const router = express.Router();

const logger = require('./utilities/initLogger');
const { renderPdfAndDownload, renderPdfAndUpload } = require('./utilities/generater');

// get the list of request end-points
router.get('/', (req, res) => {
    res.send({
        '/render (post)': 'return template data',
        '/download-pdf (post)': 'render pdf and download',
        '/upload-pdf (post)': 'render pdf and upload to s3'
    })
})

// respond with return template data when post request is made
router.post('/render', (req, res) => {
    dataObject = req.body;
    responseDataObject = require('./index')(req.body)
    res.send(responseDataObject);
});

// render and download pdf 
router.post('/download-pdf', (req, res) => {
    logger('access', '[from routes.js] post(/download-pdf)\nRequest received');
    renderPdfAndDownload(req.body)
        .then(result => {
            logger('info', '[from routes.js] post(/download-pdf)\nResult:' + JSON.stringify(result));
            logger('debug', '[from routes.js] post(/download-pdf)\nResult:' + JSON.stringify(result)); 
            res.send(result);
        })
        .catch(error => {
            // logger.logger_error.error('[from routes.js] post(/download-pdf)\n', error, '\n');
            res.status(500).send(error);
        })
})

// render and upload pdf to s3 
router.post('/upload-pdf', (req, res) => {
    logger('access', '[from routes.js] post(/upload-pdf)\nRequest received');
    renderPdfAndUpload(req.body)
        .then(result => {
            logger('info', '[from routes.js] post(/upload-pdf)\nResult:' + JSON.stringify(result));
            logger('debug', '[from routes.js] post(/upload-pdf)\nResult:' + JSON.stringify(result));
            res.send(result);
        })
        .catch(error => {
            logger('error', '[from routes.js] post(/upload-pdf)\n' + error + '\n');
            res.status(500).send(error);
        })
})

module.exports = router;
