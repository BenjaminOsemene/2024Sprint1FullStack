// Imported required modules
const readline = require('readline');
const { loadConfig, saveConfig } = require('./modules/config');
const { loadUsers, saveUsers } = require('./modules/users');
const { logEvent } = require('./modules/logger');
const { generateUserToken } = require('./token'); 

// Default configuration
const defaultConfig = { appName: 'myapp', version: '1.0.0' };

// Function to initialize application
const init = () => {
  try {
    saveConfig(defaultConfig);
    saveUsers([]);
    logEvent('Application initialized');
    console.log('Application initialized');
  } catch (err) {
    console.error('Error initializing application', err);
  }
};

// Function to display current configuration
const viewConfig = () => {
  const config = loadConfig();
  const users = loadUsers();

  console.log('Current Configuration:');
  console.log('Config:', config);
  console.log('Users:', users);
};

// Function to update configuration
const updateConfig = () => {
  
};

// Function to reset configuration
const resetConfig = () => {
  saveConfig(defaultConfig);
  console.log('Configuration reset to default values successfully!');
  showMenu();
};

// Function to generate user token using imported generateUserToken function
const generateToken = () => {
  const users = loadUsers();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter username: ', (username) => {
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log(`User "${username}" not found.`);
      rl.close();
      showMenu();
      return;
    }

    const token = generateUserToken(user); 
    console.log(`Token for user "${username}": ${token}`);
    rl.close();
    showMenu();
  });
};

// Command-line interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const showMenu = () => {
  console.log('Welcome to the Application Setup CLI');
  console.log('Please select an option:');
  console.log('1. Initialize and configure application');
  console.log('2. View current configuration');
  console.log('3. Update configuration');
  console.log('4. Reset configuration to default');
  console.log('5. Generate user token');
  console.log('6. Exit');

  rl.question('Enter your choice: ', (choice) => {
    switch (choice) {
      case '1':
        console.log('Initializing and configuring application...');
        init();
        console.log('Initialization and configuration completed successfully!');
        showMenu();
        break;
      case '2':
        viewConfig();
        showMenu();
        break;
      case '3':
        updateConfig();
        break;
      case '4':
        resetConfig();
        break;
      case '5':
        generateToken();
        break;
      case '6':
        console.log('Exiting...');
        rl.close();
        break;
      default:
        console.log('Invalid choice. Please try again.');
        showMenu();
        break;
    }
  });
};

showMenu();