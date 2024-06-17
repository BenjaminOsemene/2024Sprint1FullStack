//Imported the required modules
const fs = require('fs');
const path = require('path');

// Here is the path to the 'data' directory and the 'users.json' file
const dataDir = path.join(__dirname, '..', 'data');
const dataPath = path.join(dataDir, 'users.json');

// Function to load users from the 'users.json' file
const loadUsers = () => {
  try {
    // This read the contents of the 'users.json' file
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    // If there's an error reading the file, log the error and return an empty array
    console.error(`Error loading users file: ${dataPath}`, err);
    return [];
  }
};

// This is a function to save users to the 'users.json' file
const saveUsers = (users) => {
  try {
    // This creates the 'data' directory if it doesn't exist
    fs.mkdirSync(dataDir, { recursive: true });
    // Then writes the users array to the 'users.json' file
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    console.log(`Users saved successfully: ${dataPath}`);
  } catch (err) {
    // And if there's an error writing to the file, log the error
    console.error(`Error saving users file: ${dataPath}`, err);
  }
};

// This creates test usernames
const testUsers = [
  { username: 'ben_doe' },
  { username: 'ben_smith' },
  { username: 'ben_johnson' },
  { username: 'ben_wilson' },
  { username: 'ben_brown' }
];

// This then save the test users to the 'users.json' file
saveUsers(testUsers);

// Exporting the 'loadUsers' and 'saveUsers' functions
module.exports = {
  loadUsers,
  saveUsers
};