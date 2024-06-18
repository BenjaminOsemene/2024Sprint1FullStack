//Imported the required modules
const readline = require('readline');
const {
  init,
  viewConfig,
  updateConfig,
  resetConfig,
  generateToken,
  addUpdateUser,
  searchUser
} = require('./app');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

//Using menu system to display the different CLI's
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
        showMenu();
        break;
      case '4':
        resetConfig();
        showMenu();
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