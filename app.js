//Imported required modules
const readline = require('readline');
const { loadConfig, saveConfig } = require('./modules/config');
const { loadUsers, saveUsers } = require('./modules/users');
const { logEvent } = require('./modules/logger');

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

// Function to display current configuration
const viewConfig = () => {
  const config = loadConfig();
  const users = loadUsers();

  console.log('Current Configuration:');
  console.log('Config:', config);
  console.log('Users:', users);
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
  console.log('3. Exit');

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