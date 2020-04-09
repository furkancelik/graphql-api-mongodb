const DataLoader = require("dataloader");
const Post = require("../models/Post");
module.exports = function posts() {
  return {
    getPosts: new DataLoader(
      async (ids) => {
        const posts = await Post.find({ user: { $in: ids } });
        return Promise.all(
          ids.map(async (id) =>
            posts.filter(({ user }) => user.toString() === id.toString())
          )
        );
      },
      { cacheKeyFn: (id) => id.toString() }
    ),
  };
};
