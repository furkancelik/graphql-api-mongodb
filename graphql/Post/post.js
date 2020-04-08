module.exports = {
  Post: {
    user: async ({ user }, args, { dataLoaders, User }) => {
      const { getUser } = dataLoaders.users;
      return getUser.load(user);
    }
  }
};
