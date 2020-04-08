module.exports = {
  Query: {
    posts: async (_, __, { Post, activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      return await Post.find().sort("-createdAt");
    },
    post: async (_, { id }, { Post, activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      return await Post.findById(id);
    }
  }
};
