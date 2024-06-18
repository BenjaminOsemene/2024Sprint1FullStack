const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, '..', 'config');
const configPath = path.join(configDir, 'config.json');

const loadConfig = () => {
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf8'));
  } catch (err) {
    console.error(`Error loading config file: ${configPath}`, err);
    return {};
  }
};

const saveConfig = (config) => {
  try {
    fs.mkdirSync(configDir, { recursive: true });
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`Config saved successfully: ${configPath}`);
  } catch (err) {
    console.error(`Error saving config file: ${configPath}`, err);
  }
};

module.exports = {
  loadConfig,
  saveConfig
};