module.exports = {
  Query: {
    users: async (_, __, { User, activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      return await User.find().sort("-createdAt");
    },
    user: async (_, { id }, { User }) => {
      await new Promise(a => setTimeout(a, 1500));
      return await User.findById(id);
    },
    me: async (_, __, { activeUser, User }) => {
      if (!activeUser) return null;
      return await User.findById(activeUser.id);
    }
  }
};
