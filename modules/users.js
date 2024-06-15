const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'data');
const dataPath = path.join(dataDir, 'users.json');

const loadUsers = () => {
  try {
    return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  } catch (err) {
    console.error(`Error loading users file: ${dataPath}`, err);
    return [];
  }
};

const saveUsers = (users) => {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(users, null, 2));
    console.log(`Users saved successfully: ${dataPath}`);
  } catch (err) {
    console.error(`Error saving users file: ${dataPath}`, err);
  }
};

module.exports = {
  loadUsers,
  saveUsers
};