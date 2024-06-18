// Imported the required modules
const fs = require('fs');
const path = require('path');

// Path to the 'data' directory and the 'users.json' file
const dataDir = path.join(__dirname, '..', 'data');
const dataPath = path.join(dataDir, 'users.json');

// Function to load users from the 'users.json' file
const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error(`Error loading users file: ${dataPath}`, err);
    return [];
  }
};

// Function to save users to the 'users.json' file
const saveUsers = (users) => {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    console.log(`Users saved successfully: ${dataPath}`);
  } catch (err) {
    console.error(`Error saving users file: ${dataPath}`, err);
  }
};

// Test users with email and phone number
const testUsers = [
  { username: 'ben_boe', email: 'ben.boe@example.com', phone: '7234567890' },
  { username: 'ben_pike', email: 'ben.pike@example.com', phone: '1987654321' },
  { username: 'ben_john', email: 'ben.john@example.com' },
  { username: 'ben_white', phone: '4551234567' },
  { username: 'ben_brown' }
];

// Save the test users to the 'users.json' file
saveUsers(testUsers);

module.exports = {
  loadUsers,
  saveUsers
};