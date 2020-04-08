module.exports = {
  Mutation: {
    createPost: async (_, { data }, { Post, activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      return await Post({ ...data, user: activeUser.id }).save();
    },
    updatePost: async (_, { id, data }, { Post, activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      return await Post.findByIdAndUpdate(id, { $set: data });
    },
    removePost: async (_, { id }, { Post, activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      await Post.deleteById(id);
      return true;
    }
  }
};
