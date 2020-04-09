const users = require("./users");
const posts = require("./posts");

module.exports = function getDataLoaders() {
  return {
    users,
    posts: posts(),
  };
};
