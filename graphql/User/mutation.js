const Token = require("../../lib/Token");
const bcrypt = require("bcryptjs");

module.exports = {
  Mutation: {
    updateUser: async (_, { id, data: { password, ...data } }, { User }) => {
      const user = await User.findByIdAndUpdate(id, { $set: data });
      if (password || password !== "") {
        user.password = password;
        await user.save();
      }
      return user;
    },
    createUser: async (_, { data }, { User }) => {
      const user = await User.findOne({ username: data.username });
      if (user) throw new Error("User already exists!");
      const newUser = await User(data).save();
      return newUser;
    },
    register: async (_, { data }, { User }) => {
      const user = await User.findOne({ username: data.username });
      if (user) throw new Error("User already exists!");
      const newUser = await User(data).save();
      return { token: Token.generate(newUser) };
    },
    login: async (_, { data }, { User }) => {
      await new Promise((r) => setTimeout(r, 2000));
      const user = await User.findOne({ username: data.username });
      if (!user) throw new Error("User does not exists!");
      const validPassword = await bcrypt.compare(data.password, user.password);
      if (!validPassword) throw new Error("Wrong password!");
      return { token: Token.generate(user) };
    },
    updateProfile: async (
      _,
      { data: { password, ...data } },
      { User, activeUser }
    ) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      const user = await User.findByIdAndUpdate(activeUser.id, { $set: data });
      if (password) {
        user.password = password;
        await user.save();
      }
      return user;
    },
    removeUser: async (_, { id }, { User }) => {
      await User.deleteById(id);
      return true;
    },
  },
};
