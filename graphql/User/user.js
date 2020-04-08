module.exports = {
  User: {
    posts: async ({ id }, args, { dataLoaders }) => {
      const { getPosts } = dataLoaders.posts;
      return getPosts.load(id);
    }
  }
};
