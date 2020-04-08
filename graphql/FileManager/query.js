const fs = require("fs");
const { extname, join } = require("path");

module.exports = {
  Query: {
    allFiles: async (_, { path }, { activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      const publicPath = join(".", "public", path);
      const allFiles = fs.readdirSync(publicPath);

      const directory = [];
      const files = [];

      allFiles.forEach((file) => {
        if (fs.statSync(join(publicPath, file)).isDirectory()) {
          file.indexOf(".") !== 0 && directory.push(file);
        } else {
          file.indexOf(".") !== 0 && files.push(file);
        }
      });

      return [
        ...directory
          .sort((a, b) => sort(a, b, publicPath))
          .map((file) =>
            response({ file, type: "directory", path, publicPath })
          ),
        ...files
          .sort((a, b) => sort(a, b, publicPath))
          .map((file) => response({ file, type: "file", path, publicPath })),
      ];
    },
  },
};

function sort(a, b, publicPath) {
  return (
    fs.statSync(`${publicPath}/${b}`).mtime.getTime() -
    fs.statSync(`${publicPath}/${a}`).mtime.getTime()
  );
}

function response({ file, type, publicPath, path }) {
  return {
    name: file,
    type,
    extname: extname(join(publicPath, file)).toLowerCase().slice(1),
    path: join(path, file),
    size: fs.statSync(join(publicPath, file)).size,
  };
}
