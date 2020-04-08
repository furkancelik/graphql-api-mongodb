const jwt = require("jsonwebtoken");

module.exports = {
  generate: ({ id, fullName, email, username }, expiresIn = 60 * 60 * 24) => {
    return jwt.sign({ id, fullName, email, username }, process.env.SECRET_KEY, {
      expiresIn,
    });
  },
  verify: async (token) => {
    return await jwt.verify(token, process.env.SECRET_KEY);
  },
};
