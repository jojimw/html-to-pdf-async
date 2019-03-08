const fs = require('fs');
const logger = require('../initLogger');

let sourceVal, replaceString;

// Funtion to generate table when coming across table tag
const generateTable = (fields, data) => {
    try {
        logger.logger_debug.debug('[From utilities/process.js] generateTable() - fields: ', fields);
        let html = '<table class="tableBody">';
        html = html + '<thead><tr>';
        fields.forEach(field => {
            html = html + '<th>' + field.split('_').join(' ') + '</th>';
        });
        html = html + '</tr></thead>';
        html = html + data.map(currentFields => {
            let subHtml = '';
            subHtml = subHtml + '<tr>';
            for (let field in currentFields) {
                subHtml = subHtml + '<td>' + currentFields[field] + '</td>';
            }
            subHtml = subHtml + '</tr>';
            return subHtml;
        }).join('');
        html += '</table>';
        return (html);
    }
    catch (err) {
        logger.logger_error.error('[From utilities/process.js] generateTable() -', err, '\n');
        throw err;
    }
};

const generateIterable = (iterableData) => {
    try {
        logger.logger_debug.debug('[From utilities/process.js] generateIterable() - iterableData: ', iterableData);
        let html = '<ol>';
        iterableData.map((iterableDataItem) => {
            html = html + `<li>${iterableDataItem}</li>`;
        });
        html += '</ol>';
        return (html);
    }
    catch (err) {
        logger.logger_error.error('[From utilities/process.js] generateiterable() -', err, '\n');
        throw err;
    }
}

// Function to process text tag
const process_text = (tag, dataObject) => {
    try {
        logger.logger_debug.debug('[From utilities/process.js] process_text() - replaceTag: ', tag[0]);
        if (tag[3]) {
            replaceString = new RegExp(`${tag[0]}`, 'g');
            replaceTagData = dataObject.substitutionData.filter(subData => {
                return '{{' + subData.type + ' ' + subData.variable + '}}' === tag[0]
            });
            if (replaceTagData.length !== 0) {
                sourceVal = replaceTagData[0].data;
            }
            else {
                sourceVal = '';
            }
            // sourceVal = dataObject.data[tag[2]][tag[3]];
            return [replaceString, sourceVal];
        }
        else {
            replaceString = new RegExp(`${tag[0]}`, 'g');
            replaceTagData = dataObject.substitutionData.filter(subData => {
                return '{{' + subData.type + ' ' + subData.variable + '}}' === tag[0]
            })
            if (replaceTagData.length !== 0) {
                sourceVal = replaceTagData[0].data;
            }
            else {
                sourceVal = '';
            }
            // sourceVal = dataObject.data[tag[2]];
            return [replaceString, sourceVal];
        }
    }
    catch (err) {
        logger.logger_error.error('[From utilities/process.js] process_text() -', err, '\n');
        throw err;
    }
};

// Function to process table tag
const process_table = (tag, dataObject) => {
    try {
        logger.logger_debug.debug('[From utilities/process.js] process_table() - replaceTag: ', tag[0]);
        replaceString = new RegExp(`${tag[0]}`, 'g');
        let replaceTagData = dataObject.substitutionData.filter(subData => {
            return '{{' + subData.type + ' ' + subData.variable + '}}' === tag[0]
        });
        if (replaceTagData.length !== 0) {
            sourceVal = replaceTagData[0].data;
        }
        else {
            sourceVal = '';
        }
        return [replaceString, sourceVal];
    }
    catch (err) {
        logger.logger_error.error('[From utilities/process.js] process_table() -', err, '\n');
        throw err;
    }
};

const process_tableBody = (tag, dataObject) => {
    try {
        logger.logger_debug.debug('[From utilities/process.js] process_table() - replaceTag: ', tag[0]);
        replaceString = new RegExp(`${tag[0]}`, 'g');
        let tableTagDetails = dataObject.substitutionData.filter(subData => {
            return '{{' + subData.type + ' ' + subData.variable + '}}' === tag[0]
        });
        if (tableTagDetails.length !== 0) {
            let tableDetails = tableTagDetails[0].data;
            sourceVal = generateTable(tableDetails.tableHead, tableDetails.tableData);
        }
        else {
            sourceVal = '';
        }
        return [replaceString, sourceVal];
    }
    catch (err) {
        logger.logger_error.error('[From utilities/process.js] process_tableBody() -', err, '\n');
        throw err;
    }
};

const process_iterable = (tag, dataObject) => {
    try {
        logger.logger_debug.debug('[From utilities/process.js] process_iterable() - replaceTag: ', tag[0]);
        if (tag[3]) {
            replaceString = new RegExp(`${tag[0]}`, 'g');
            let iterableTagDetails = dataObject.substitutionData.filter(subData => {
                return '{{' + subData.type + ' ' + subData.variable + '}}' === tag[0]
            });
            if (iterableTagDetails.length !== 0) {
                let iterableDetails = iterableTagDetails[0].data;
                sourceVal = generateIterable(iterableDetails);
            }
            else {
                sourceVal = '';
            }
            return [replaceString, sourceVal];
        }
        else {
            replaceString = new RegExp(`${tag[0]}`, 'g');
            replaceTagData = dataObject.substitutionData.filter(subData => {
                return '{{' + subData.type + ' ' + subData.variable + '}}' === tag[0]
            })
            if (replaceTagData.length !== 0) {
                sourceVal = replaceTagData[0].data;
            }
            else {
                sourceVal = '';
            }
            return [replaceString, sourceVal];
        }
    }
    catch (err) {
        logger.logger_error.error('[From utilities/process.js] process_iterable() -', err, '\n');
        throw err;
    }
};

// function to append the data in place of the appendData
const process_append = (appendData) => {
    try {
        logger.logger_debug.debug('[From utilities/process.js] process_append() executed');
        if (appendData) {
            let appendHtml = '';
            appendData.map(appendDataItem => {
                appendHtml = appendHtml + `
                <div style="color:${appendDataItem.color}; margin:1rem 0; font-size:0.9rem; width:20rem; background-color:#616161; height:6rem; padding:1rem; border:1px solid black; float:${appendDataItem.position}; text-align:${appendDataItem.position};">${appendDataItem.field}</div>
                `;
            });
            return ['{{appendData}}', appendHtml];
        }
        else {
            return ['{{appendData}}', ''];
        }
    }
    catch (err) {
        logger.logger_error.error('[From utilities/process.js] process_append() -', err, '\n');
        throw err;
    }
}

// Funtion to get the template from './documents/templates' folder
const process_template = (dataObject) => {
    try {
        let dir = `./documents/${dataObject.templateId.split('.').join('/')}.html`;
        logger.logger_debug.debug('[From utilities/process.js] process_template() - dir:', dir);
        return fs.readFileSync(dir, 'utf8');
    }
    catch (err) {
        logger.logger_error.error('[From utilities/process.js] process_template() -', err, '\n');
        throw err;
    }
}

module.exports = {
    process_text,
    process_table,
    process_tableBody,
    process_iterable,
    process_template,
    process_append
}