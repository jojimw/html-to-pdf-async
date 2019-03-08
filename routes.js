const express = require('express');
const router = express.Router();

// respond with return data when post request is made
router.post('/render', (req, res) => {
    dataObject = req.body;
    responseDataObject = require('./index')(req.body)
    console.log("recieved request")
    // let responseTemplate = JSON.stringify(responseDataObject.templateData);
    // responseDataObject.templateData = responseTemplate;
    res.send(responseDataObject);
});

module.exports = router;
