const fs = require("fs");
const { extname, join } = require("path");
const slug = require("slug");

function deleteFolderRecursive(subPath) {
  if (fs.existsSync(subPath)) {
    fs.readdirSync(subPath).forEach((file, index) => {
      const curPath = join(subPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(subPath);
  }
}

module.exports = {
  Mutation: {
    rename: async (_, { name, path }, { activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      const newPath = path.split("/");
      newPath.pop();
      fs.renameSync(
        join(".", "public", path),
        join(".", "public", `${newPath.join("/")}/${name}${extname(path)}`)
      );
      return true;
    },

    uploadFile: async (_, { files, path }, { activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");

      const res = [];
      await Promise.all(
        files.map(async (file, i) => {
          const { createReadStream, filename, mimetype } = await file;
          await new Promise((resolve, reject) => {
            const name = slug(filename, {
              replacement: "-",
              remove: null,
            });
            createReadStream()
              .on("error", (error) => reject(error))
              .pipe(
                fs.createWriteStream(
                  join(__dirname, "..", "..", "public", path, name)
                )
              )
              .on("error", reject)
              .on("finish", () => {
                const stat = fs.statSync(
                  join(__dirname, "..", "..", "public", path, name)
                );
                res.push({
                  name,
                  type: stat.isDirectory() ? "directory" : "file",
                  extname: extname(join(filename)).toLowerCase().slice(1),
                  path: join(path, name),
                  size: stat.size,
                });
                resolve();
              });
          });
        })
      );

      return res;
    },
    removeFile: async (_, { path: mainPath }, { activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      const path = mainPath.map((file) => {
        return join(".", "public", file);
      });
      path.map((file) => {
        if (fs.statSync(file).isDirectory()) {
          deleteFolderRecursive(file);
        } else {
          fs.unlinkSync(file);
        }
      });
      return true;
    },
    createFolder: async (_, { data: { name, path } }, { activeUser }) => {
      if (!activeUser) throw new Error("You are not authenticated!");
      if (fs.existsSync(join(".", "public", path, name))) {
        throw new Error(
          `"${name}" adı önceden kullanılmış. Lütfen farklı bir ad seçin.`
        );
      } else {
        fs.mkdirSync(join(".", "public", path, name));
        return true;
      }
    },
  },
};
