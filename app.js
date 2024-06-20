// Import required modules
const fs = require('fs');
const path = require('path');
const { newToken, tokenCount, listTokens, updateToken, searchTokens } = require('./token');

const configFilePath = path.join(__dirname, 'config.json');
//const usersFilePath = path.join(__dirname, 'users.json');
const usersFilePath = path.join(__dirname, 'data', 'users.json');

const defaultConfig = {
  appName: 'MyAppCLI',
  version: '1.0.0',
  description: 'The Command Line Interface(CLI)',
  main: 'cli.js',
};

// Load configuration from the config.json file
const loadConfig = () => {
  try {
    if (fs.existsSync(configFilePath)) {
      return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
    }
  } catch (error) {
    console.error(`Error loading config: ${error.message}`);
  }
  return defaultConfig;
};

// Save configuration to the config.json file
const saveConfig = (config) => {
  try {
    fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error(`Error saving config: ${error.message}`);
  }
};

// Load users from the users.json file
const loadUsers = () => {
  try {
    if (fs.existsSync(usersFilePath)) {
      return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
    }
  } catch (error) {
    console.error(`Error loading users: ${error.message}`);
  }
  return [];
};

// Save users to the users.json file
const saveUsers = (users) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error(`Error saving users: ${error.message}`);
  }
};

// Handle the available commands
const handleCommand = (command, options) => {
  switch (command) {
    case 'init':
      initializeApplication();
      break;
    case 'status':
      showStatus();
      break;
    case 'config':
      handleConfigCommand(options);
      break;
    case 'token':
      handleTokenCommand(options);
      break;
    default:
      console.error(`Error: Invalid command "${command}"`);
      process.exit(1);
  }
};

// Initialize the application
const initializeApplication = () => {
  const config = loadConfig();
  console.log('Initializing application...');
  console.log(`Application name: ${config.appName}`);
  console.log(`Application version: ${config.version}`);
  console.log(`Application description: ${config.description}`);
  console.log(`Application main: ${config.main}`);

  // Create required directories and files
  const dirPath = path.join(__dirname, 'app');
  const configPath = path.join(dirPath, 'config.json');
  const helpPath = path.join(dirPath, 'help.txt');

  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }

    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    }

    if (!fs.existsSync(helpPath)) {
      const helpContent = 'This is a help file for the application.';
      fs.writeFileSync(helpPath, helpContent);
    }
    console.log('Initialization completed successfully.');
  } catch (error) {
    console.error(`Error during initialization: ${error.message}`);
    process.exit(1);
  }
};

// Show the application status
const showStatus = () => {
  const config = loadConfig();
  console.log('Application Status:');
  console.log(`Name: ${config.appName}`);
  console.log(`Version: ${config.version}`);
  console.log(`Description: ${config.description}`);
};

// Handle configuration-related commands
const handleConfigCommand = (options) => {
  const config = loadConfig();
  const [optionName, ...restOptions] = options;
  switch (optionName) {
    case '--show':
      console.log('Current configuration:');
      console.log(JSON.stringify(config, null, 2));
      break;
    case '--reset':
      saveConfig(defaultConfig);
      console.log('Configuration reset to default values.');
      break;
    case '--set':
      const [property, ...valueParts] = restOptions;
      const value = valueParts.join(' ');
      if (property && value) {
        config[property] = value;
        saveConfig(config);
        console.log('Configuration updated successfully.');
      } else {
        console.error('Error: Configuration property and value are required for the "--set" option');
        process.exit(1);
      }
      break;
    default:
      console.error(`Error: Invalid option "${optionName}" for "config" command`);
      process.exit(1);
  }
};

// Handle token-related commands
const handleTokenCommand = (options) => {
  const [subCommand, ...subOptions] = options;
  switch (subCommand) {
    case '--new':
      const username = subOptions.join(' ');
      registerUser(username);
      break;
    case '--upd':
      updateTokenField(subOptions);
      break;
    case '--search':
      searchTokenField(subOptions);
      break;
    default:
      console.error(`Error: Invalid token sub-command "${subCommand}"`);
      process.exit(1);
  }
};

// Register a new user
const registerUser = (username) => {
  if (!username) {
    console.error('Error: Username is required');
    process.exit(1);
  }

  const users = loadUsers();
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    console.error(`Error: User with username "${username}" already exists`);
    process.exit(1);
  }

  try {
    newToken(username);
    console.log(`User "${username}" registered successfully.`);
    users.push({ username });
    saveUsers(users);
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
    process.exit(1);
  }
};

// Update a token field
const updateTokenField = (options) => {
  const [field, username, value] = options;
  if (!field || !username || !value) {
    console.error('Error: Field, username, and value are required');
    process.exit(1);
  }

  updateToken(field, username, value)
    .then(() => {
      console.log(`Token for user "${username}" updated successfully.`);
    })
    .catch(err => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
};

// Search for tokens by field
const searchTokenField = (options) => {
  const [field, value] = options;
  if (!field || !value) {
    console.error('Error: Field and value are required');
    process.exit(1);
  }

  searchTokens(field, value)
    .then(tokens => {
      console.log('Matching tokens:', tokens);
    })
    .catch(err => {
      console.error(`Error: ${err.message}`);
      process.exit(1);
    });
};

// Parse the command-line arguments
const [, , command, ...options] = process.argv;

// Execute the command
handleCommand(command, options);
