/*//Imported required modules
const fs = require('fs');
const path = require('path');
const { generateToken } = require('./token');

const configFilePath = path.join(__dirname, 'config.json');
const usersFilePath = path.join(__dirname, 'users.json');
const defaultConfig = {
  appName: 'MyAppCLI',
  version: '1.0.0',
  description:'The Command Line Interface(CLI)',
  main: 'cli.js',
};

// Load configuration from the config.json file
const loadConfig = () => {
  if (fs.existsSync(configFilePath)) {
    return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  }
  return defaultConfig;
};

// Save configuration to the config.json file
const saveConfig = (config) => {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
};

// Load users from the users.json file
const loadUsers = () => {
  if (fs.existsSync(usersFilePath)) {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  }
  return [];
};

// Save users to the users.json file
const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Handle the available commands
const handleCommand = (command, options) => {
  switch (command) {
    case 'init':
      initializeApplication();
      break;
    case 'config':
      handleConfigCommand(options);
      break;
    case 'token':
      handleTokenCommand(options);
      break;
    default:
      console.error(`Error: Invalid command "${command}"`);
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
      }
      break;
    default:
      console.error(`Error: Invalid option "${optionName}" for "config" command`);
  }
};

// Handle token-related commands
const handleTokenCommand = (options) => {
  const [subCommand, ...subOptions] = options;
  switch (subCommand) {
    case '--count':
      countTokens();
      break;
    case '--new':
      const username = subOptions.join(' ');
      registerUser(username);
      break;
    case '--upd':
      updateUser(subOptions);
      break;
    case '--search':
      searchUser(subOptions);
      break;
    case '--generate-missing':
      generateMissingTokens();
      break;
    default:
      console.error(`Error: Invalid token sub-command "${subCommand}"`);
  }
};

// Count the number of tokens
const countTokens = () => {
  const users = loadUsers();
  console.log(`Number of tokens: ${users.length}`);
};

// Register a new user
const registerUser = (username) => {
  if (!username) {
    console.error('Error: Username is required');
    return;
  }

  const users = loadUsers();
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    console.error(`Error: User with username "${username}" already exists`);
    return;
  }

  const token = generateToken({ username });
  const newUser = { username, token };
  users.push(newUser);
  saveUsers(users);
  console.log(`User "${username}" registered successfully. Token: ${token}`);
};

// Update user information
const updateUser = (options) => {
  const [field, username, ...valueParts] = options;
  const value = valueParts.join(' ');
  if (!username || !value) {
    console.error('Error: Invalid option format. Expected: <field> <username> <value>');
    return;
  }

  const users = loadUsers();
  const userIndex = users.findIndex(user => user.username === username);
  if (userIndex === -1) {
    console.error(`Error: User with username "${username}" not found`);
    return;
  }

  const user = users[userIndex];
  if (field === 'e') {
    user.email = value;
  } else if (field === 'p') {
    user.phone = value;
  } else {
    console.error(`Error: Invalid field "${field}". Allowed fields: e (email), p (phone)`);
    return;
  }

  users[userIndex] = user;
  saveUsers(users);
  console.log(`User "${username}" updated successfully.`);
};

// Search for a user
const searchUser = (options) => {
  const [field, value] = options;
  if (!field || !value) {
    console.error('Error: Invalid search format. Expected: <field> <value>');
    return;
  }

  const users = loadUsers();
  let matchedUsers;

  if (field === 'u') {
    matchedUsers = users.filter(user => user.username.includes(value));
  } else if (field === 'p') {
    matchedUsers = users.filter(user => user.phone && user.phone.includes(value));
  } else {
    console.error(`Error: Invalid search field "${field}". Allowed fields: u (username), p (phone)`);
    return;
  }

  if (matchedUsers.length === 0) {
    console.log(`No users found matching "${value}"`);
  } else {
    console.log(`Users matching "${value}":`);
    matchedUsers.forEach(user => {
      console.log(`- Username: ${user.username}, Email: ${user.email || 'N/A'}, Phone: ${user.phone || 'N/A'}`);
    });
  }
};

// Generate tokens for existing users without tokens
const generateMissingTokens = () => {
  const users = loadUsers();
  let updated = false;
  users.forEach(user => {
    if (!user.token) {
      user.token = generateToken({ username: user.username });
      updated = true;
    }
  });

  if (updated) {
    saveUsers(users);
    console.log('Tokens generated for users without tokens.');
  } else {
    console.log('All users already have tokens.');
  }
};

// Parse the command-line arguments
const [, , command, ...options] = process.argv;

// Execute the command
handleCommand(command, options);
*/

//Imported required modules
const fs = require('fs');
const path = require('path');
const { newToken, tokenCount, listTokens } = require('./token');

const configFilePath = path.join(__dirname, 'config.json');
const usersFilePath = path.join(__dirname, 'users.json');
const defaultConfig = {
  appName: 'MyAppCLI',
  version: '1.0.0',
  description:'The Command Line Interface(CLI)',
  main: 'cli.js',
};

// Load configuration from the config.json file
const loadConfig = () => {
  if (fs.existsSync(configFilePath)) {
    return JSON.parse(fs.readFileSync(configFilePath, 'utf8'));
  }
  return defaultConfig;
};

// Save configuration to the config.json file
const saveConfig = (config) => {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
};

// Load users from the users.json file
const loadUsers = () => {
  if (fs.existsSync(usersFilePath)) {
    return JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
  }
  return [];
};

// Save users to the users.json file
const saveUsers = (users) => {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
};

// Handle the available commands
const handleCommand = (command, options) => {
  switch (command) {
    case 'init':
      initializeApplication();
      break;
    case 'config':
      handleConfigCommand(options);
      break;
    case 'token':
      handleTokenCommand(options);
      break;
    default:
      console.error(`Error: Invalid command "${command}"`);
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
      }
      break;
    default:
      console.error(`Error: Invalid option "${optionName}" for "config" command`);
  }
};

// Handle token-related commands
const handleTokenCommand = (options) => {
  const [subCommand, ...subOptions] = options;
  switch (subCommand) {
    case '--count':
      countTokens();
      break;
    case '--new':
      const username = subOptions.join(' ');
      registerUser(username);
      break;
    case '--list':
      listAllTokens();
      break;
    default:
      console.error(`Error: Invalid token sub-command "${subCommand}"`);
  }
};

// Count the number of tokens
const countTokens = () => {
  tokenCount().then(count => {
    console.log(`Number of tokens: ${count}`);
  }).catch(err => {
    console.error(`Error: ${err.message}`);
  });
};

// Register a new user
const registerUser = (username) => {
  if (!username) {
    console.error('Error: Username is required');
    return;
  }

  const users = loadUsers();
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    console.error(`Error: User with username "${username}" already exists`);
    return;
  }

  newToken(username);
  console.log(`User "${username}" registered successfully.`);
};

// List all tokens
const listAllTokens = () => {
  listTokens().then(tokens => {
    console.log('Tokens:', tokens);
  }).catch(err => {
    console.error(`Error: ${err.message}`);
  });
};

// Parse the command-line arguments
const [, , command, ...options] = process.argv;

// Execute the command
handleCommand(command, options);


