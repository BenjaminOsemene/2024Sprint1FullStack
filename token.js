//Imported required modules
const fs = require('fs');
const crc32 = require('crc').crc32;
const { addDays } = require('date-fns');
const path = require('path');

const usersFilePath = path.join(__dirname, 'data', 'token.json'); 

// Create new token for a user using crc32, checks if token exist, reads and writes token data
const newToken = (username) => {
  try {
    const token = crc32(username).toString(16);
    const createdAt = new Date();
    const expiresAt = addDays(createdAt, 3);

    const tokenObj = {
      username,
      token,
      createdAt,
      expiresAt,
    };

    const tokens = loadTokens();
    tokens.push(tokenObj);
    saveTokens(tokens);
    return tokenObj;
  } catch (error) {
    console.error(`Error creating new token: ${error.message}`);
    return null;
  }
};

const generateUserToken = (username) => {
  try {
    const tokens = loadTokens();
    const existingToken = tokens.find(t => t.username === username);
    if (existingToken) {
      console.log(`Token already exists for ${username}: ${existingToken.token}`);
      return existingToken;
    } else {
      const newTokenObj = newToken(username);
      if (newTokenObj) {
        console.log(`New token created for ${username}: ${newTokenObj.token}`);
        return newTokenObj;
      } else {
        console.error(`Failed to create new token for ${username}`);
        return null;
      }
    }
  } catch (error) {
    console.error(`Error generating user token: ${error.message}`);
    return null;
  }
};

const loadTokens = () => {
  try {
    if (fs.existsSync(usersFilePath)) {
      const data = fs.readFileSync(usersFilePath, 'utf8');
      return JSON.parse(data);
    } else {
      return [];
    }
  } catch (error) {
    console.error(`Error loading tokens: ${error.message}`);
    return [];
  }
};

const saveTokens = (tokens) => {
  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.error(`Error saving tokens: ${error.message}`);
  }
};

const tokenCount = () => {
  return new Promise((resolve, reject) => {
    const tokens = loadTokens();
    resolve(tokens.length);
  });
};

const listTokens = () => {
  return new Promise((resolve, reject) => {
    const tokens = loadTokens();
    resolve(tokens);
  });
};

const updateToken = (field, username, value) => {
  return new Promise((resolve, reject) => {
    const tokens = loadTokens();
    const token = tokens.find(t => t.username === username);
    if (token) {
      token[field] = value;
      saveTokens(tokens);
      resolve();
    } else {
      reject(new Error('Token not found'));
    }
  });
};

const searchTokens = (field, value) => {
  return new Promise((resolve, reject) => {
    const tokens = loadTokens();
    const matchingTokens = tokens.filter(t => t[field] === value);
    resolve(matchingTokens);
  });
};


const tokenApplication = async () => {
  const args = process.argv.slice(2);

  try {
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
      case '--upd':
        if (args.length < 4) {
          console.error('Field, username, and value are required');
          break;
        }
        await updateToken(args[1], args[2], args[3]);
        console.log(`Token for user ${args[2]} updated successfully`);
        break;
      case '--search':
        if (args.length < 3) {
          console.error('Field and value are required');
          break;
        }
        const matchingTokens = await searchTokens(args[1], args[2]);
        console.log('Matching tokens:', matchingTokens);
        break;
      case '--generate':
        if (!args[1]) {
          console.error('Username is required');
          break;
        }
        const generatedToken = generateUserToken(args[1]);
        if (generatedToken) {
          console.log(`Token for ${args[1]}: ${generatedToken.token}`);
        }
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
  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
  }
};

module.exports = {
  tokenApplication,
  newToken,
  tokenCount,
  listTokens,
  updateToken,
  searchTokens,
  generateUserToken,
};
