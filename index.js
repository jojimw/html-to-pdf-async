const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);

const router = require('./routes');
const logger = require('./utilities/initLogger');
const { generateTemplate, appendToTemplate } = require('./utilities/generater');
const { port, ip } = require('./env-config');

app.use(express.json());
app.use(bodyParser.json());
app.use('/', router);

server.listen(port, ip, () => {
    console.log('Node server running...');
    logger('info', `App listening at IP address: ${ip} and port: ${port}`);
    logger('access', `App listening at IP address: ${ip} and port: ${port}`);
});

// Call the respective functions in index.js
const mainFunction = (dataObject) => {
    try {
        logger('debug', '[From index.js] mainFunction executed');

        if (dataObject.config.substitution) {
            // generate template after substituting the variables
            dataObject.templateData = generateTemplate(dataObject);
            dataObject.templateData = dataObject.templateData.replace('\n', '');
        }
        if (dataObject.config.append) {
            dataObject.templateData = appendToTemplate(dataObject.templateData, dataObject, dataObject.append);
        }
        return dataObject;
    }
    catch (err) {
        logger('error', '[From index.js] mainFunction() - ' + err + '\n');
        throw err;
    }
}

module.exports = mainFunction;
