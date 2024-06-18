//Imported required modules
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.static(__dirname));

let users = [];

// Load users from users.json file (if it exists)
const usersFilePath = path.join(__dirname, 'users.json');
if (fs.existsSync(usersFilePath)) {
  users = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
}

// Craete a token for a given username
function generateToken(username) {
  return `token_for_${username}`;
}

// Register a new user and generate a token
app.post('/register', (req, res) => {
  const username = req.query.username;

  // Checking  if the username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(400).send('Username already exists');
  }

  // Generate a token for the new user
  const token = generateToken(username);

  // Adding new user to the data store
  const newUser = { username, token };
  users.push(newUser);

  // Saving  the updated users data to a file
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

  // Sending token as the response
  res.send(token);
});

// Starting the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});










