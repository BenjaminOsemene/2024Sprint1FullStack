const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '..', 'logs');
const logsPath = path.join(logsDir, 'events.log');

const logEvent = (event) => {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
    fs.appendFileSync(logsPath, `${new Date().toISOString()} - ${event}\n`);
    console.log(`Event logged: ${event}`);
  } catch (err) {
    console.error(`Error logging event to ${logsPath}`, err);
  }
};

module.exports = {
  logEvent
};