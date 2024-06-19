// Imported required module
const crypto = require('crypto');

const generateToken = (user) => {
  const { username } = user;
  // Using a secure secret key
  const secret = process.env.TOKEN_SECRET || '8Ux7$Ky9';
  const payload = { username };
  const token = crypto.createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return token;
};

module.exports = {
  generateToken
};




