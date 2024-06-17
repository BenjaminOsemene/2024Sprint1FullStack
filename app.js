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

    // Save the token to the user object
    user.token = token;

    // Save the updated users array to the users.json file
    saveUsers(users);

    rl.close();
    showMenu();
  });
};

// Function to add/update user contact information
const addUpdateUser = () => {
  const users = loadUsers();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter username: ', (username) => {
    const user = users.find(u => u.username === username);
    if (!user) {
      console.log(`User "${username}" not found. Creating new user...`);
      const newUser = { username };
      rl.question('Enter email (optional): ', (email) => {
        if (email) newUser.email = email;
        rl.question('Enter phone number (optional): ', (phone) => {
          if (phone) newUser.phone = phone;
          users.push(newUser);
          saveUsers(users);
          console.log(`User "${username}" added/updated successfully!`);
          rl.close();
          showMenu();
        });
      });
    } else {
      console.log(`User "${username}" found.`);
      rl.question('Enter new email (leave blank to keep current): ', (email) => {
        if (email) user.email = email;
        else if (user.email) console.log(`Current email: ${user.email}`);
        rl.question('Enter new phone number (leave blank to keep current): ', (phone) => {
          if (phone) user.phone = phone;
          else if (user.phone) console.log(`Current phone number: ${user.phone}`);
          saveUsers(users);
          console.log(`User "${username}" updated successfully!`);
          rl.close();
          showMenu();
        });
      });
    }
  });
};

// Function to search for a user
const searchUser = () => {
  const users = loadUsers();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Enter username, email, or phone number: ', (query) => {
    const user = users.find(
      (u) =>
        u.username === query ||
        u.email === query ||
        u.phone === query
    );

    if (!user) {
      console.log(`No user found with the provided query: ${query}`);
    } else {
      console.log(`User found:`);
      console.log(user);
    }

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
  console.log('6. Add/Update user contact information');
  console.log('7. Search for a user');
  console.log('8. Exit');

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
        addUpdateUser();
        break;
      case '7':
        searchUser();
        break;
      case '8':
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