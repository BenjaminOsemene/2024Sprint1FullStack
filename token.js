/*const fs = require('fs');
const crc32 = require('crc/crc32');
const { format } = require('date-fns');

// Helper Functions
const newToken = (username) => {
  const token = crc32(username).toString(16);
  const createdAt = new Date();
  const expiresAt = addDays(createdAt, 3);

  const tokenObj = {
    username,
    token,
    createdAt,
    expiresAt,
  };

  const tokens = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  tokens.push(tokenObj);
  fs.writeFileSync('users.json', JSON.stringify(tokens, null, 2));
};

const tokenCount = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const tokens = JSON.parse(data);
        resolve(tokens.length);
      }
    });
  });
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Main Function
const tokenApplication = async () => {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case '--count':
      const count = await tokenCount();
      console.log(`Token count: ${count}`);
      break;
    case '--list':
      // TODO: Implement token listing
      break;
    case '--new':
      if (!args[1]) {
        console.error('Username is required');
        break;
      }
      newToken(args[1]);
      console.log(`New token created for ${args[1]}`);
      break;
    case '--help':
    case '-h':
      //const usage = fs.readFileSync('usage.txt', 'utf8');
     // console.log(usage);
      break;
    default:
      const usage = fs.readFileSync('usage.txt', 'utf8');
      console.log(usage);
  }
};

// Exports
module.exports = {
  tokenApplication,
  newToken,
  tokenCount,
};
*/



const fs = require('fs');
const crc32 = require('crc/crc32');
const { format, addDays } = require('date-fns');

// Helper Functions
const newToken = (username) => {
  const token = crc32(username).toString(16);
  const createdAt = new Date();
  const expiresAt = addDays(createdAt, 3);

  const tokenObj = {
    username,
    token,
    createdAt,
    expiresAt,
  };

  const tokens = JSON.parse(fs.readFileSync('users.json', 'utf8'));
  tokens.push(tokenObj);
  fs.writeFileSync('users.json', JSON.stringify(tokens, null, 2));
};

const tokenCount = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const tokens = JSON.parse(data);
        resolve(tokens.length);
      }
    });
  });
};

const listTokens = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('users.json', 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        const tokens = JSON.parse(data);
        resolve(tokens);
      }
    });
  });
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Main Function
const tokenApplication = async () => {
  const args = process.argv.slice(2);

  switch (args[0]) {
    case '--count':
      const count = await tokenCount();
      console.log(`Token count: ${count}`);
      break;
    case '--list':
      const tokens = await listTokens();
      console.log(tokens);
      break;
    case '--new':
      if (!args[1]) {
        console.error('Username is required');
        break;
      }
      newToken(args[1]);
      console.log(`New token created for ${args[1]}`);
      break;
    case '--help':
    case '-h':
      const usage = fs.readFileSync('usage.txt', 'utf8');
      console.log(usage);
      break;
    default:
      const usageDefault = fs.readFileSync('usage.txt', 'utf8');
      console.log(usageDefault);
  }
};

// Exports
module.exports = {
  tokenApplication,
  newToken,
  tokenCount,
  listTokens
};
