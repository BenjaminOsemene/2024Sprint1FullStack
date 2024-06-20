//Imported required modules
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const crc = require('crc');

app.use(express.static(__dirname));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let users = [];

// Load users from users.json file 
const usersFilePath = path.join(__dirname, 'users.json');
if (fs.existsSync(usersFilePath)) {
  users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

// Create CRC token for a given username
function generateToken(username) {
  return crc.crc32(username).toString(16);
}

// Register and generate new user token
app.post('/register', (req, res) => {
  const { username } = req.body;

  // Check if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).send('Username already exists');
  }

  // create token for the new user
  const token = generateToken(username);

  // Add new user to the data store
  const newUser = { username, token };
  users.push(newUser);

  // Save updated users data to a file
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  // Send token as the response
  res.send(token);
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});










