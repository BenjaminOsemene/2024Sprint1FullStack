//Define function to generate user token and export it
const generateUserToken = (user) => {
    const token = `token_for_${user.username}`;
    return token;
  };
  
  module.exports = {
    generateUserToken
  };