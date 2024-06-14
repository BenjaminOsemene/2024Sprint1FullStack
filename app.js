//Imported required modules
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Define paths
const configDir = path.join(__dirname, 'config');
const configPath = path.join(configDir, 'config.json');
const dataDir = path.join(__dirname, 'data');
const dataPath = path.join(dataDir, 'users.json');
const logsDir = path.join(__dirname, 'logs');
const logsPath = path.join(logsDir, 'events.log');

// Function to load configuration and return empty if config file does not exist
const loadConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.error(`Error loading config file: ${configPath}`, err);
    return {}; 
  }
};

// Function to save configuration and create config directory
const saveConfig = (config) => {
  try {
    fs.mkdirSync(configDir, { recursive: true }); 
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Config saved successfully: ${configPath}`); 
  } catch (err) {
    console.error(`Error saving config file: ${configPath}`, err);
  }
};

// Function to load users and returns empty array if users file does not exist
const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error(`Error loading users file: ${dataPath}`, err);
    return []; 
  }
};

// Function to save users and create data directory
const saveUsers = (users) => {
  try {
    fs.mkdirSync(dataDir, { recursive: true }); 
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    console.log(`Users saved successfully: ${dataPath}`); 
  } catch (err) {
    console.error(`Error saving users file: ${dataPath}`, err);
  }
};

// Function to log events and create logs directory
const logEvent = (event) => {
  try {
    fs.mkdirSync(logsDir, { recursive: true }); 
    fs.appendFileSync(logsPath, `${new Date().toISOString()} - ${event}\n`);
    console.log(`Event logged: ${event}`); 
  } catch (err) {
    console.error(`Error logging event to ${logsPath}`, err);
  }
};

// Function to initialize application
const init = () => {
  try {
    const defaultConfig = { appName: 'myapp', version: '1.0.0' };
    saveConfig(defaultConfig);
    saveUsers([]);
    logEvent('Application initialized');
    console.log('Application initialized'); 
  } catch (err) {
    console.error('Error initializing application', err);
  }
};

// Calling init function directly
init();

// Export functions to be used for other modules
module.exports = {
  loadConfig,
  saveConfig,
  loadUsers,
  saveUsers,
  logEvent
};