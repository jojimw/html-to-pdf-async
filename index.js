const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const server = require('http').createServer(app);

const router = require('./routes/routes');
const logger = require('./logs/initLogger');
const generater = require('./generater');

app.use(express.json());
app.use(bodyParser.json());
app.use('/', router);

server.listen(3001,"0.0.0.0", () => {
    console.log('App listening at port 3001....');
});

// Call the respective functions in index.js
const mainFunction = (dataObject) => {
    try {
        logger.logger_debug.debug('[From index.js] mainFunction executed');

        if (dataObject.config.substitution) {
            // generate template after substituting the variables
            dataObject.templateData = generater.generateTemplate(dataObject);
            dataObject.templateData = dataObject.templateData.replace('\n', '');
        }
        if (dataObject.config.append) {
            dataObject.templateData = generater.appendToTemplate(dataObject.templateData, dataObject, dataObject.append);
        }
        return dataObject;
    }
    catch (err) {
        logger.logger_error.error('[From index.js] mainFunction() - ', err, '\n');
        throw err;
    }
}

module.exports = mainFunction;