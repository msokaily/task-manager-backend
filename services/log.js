const fs = require('fs');
const path = require('path');

const logFilePath = path.join(__dirname, '../errors.log');

const logService = (userId, action, data = {}) => {
    const timestamp = new Date().toISOString();
    const logMessage = `User ${userId} ${action} on ${timestamp} -> ${JSON.stringify(data)}\n`;

    console.log(logMessage);

    fs.appendFile(logFilePath, logMessage, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
};

module.exports = logService;