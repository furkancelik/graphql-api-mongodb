const DataLoader = require("dataloader");
const User = require("../models/User");

module.exports = {
  getUser: new DataLoader(
    async ids => {
      const users = await User.find({ _id: { $in: ids } });
      return Promise.all(
        ids.map(async id =>
          users.find(({ _id }) => _id.toString() === id.toString())
        )
      );
    },
    { cacheKeyFn: id => id.toString() }
  )
};
