const { join } = require("path");
const dotenv = require("dotenv");
dotenv.config();
const connect = require("../lib/db");
const globby = require("globby");

connect();

(async () => {
  const allSeeder = await globby.sync(
    [join(__dirname, "*.js"), join("!", __dirname, "index.js")],
    {
      absolute: true,
    }
  );

  await Promise.all(
    allSeeder.map(
      async (path) =>
        await import(path)
          .then((m) => m.default || m)
          .then((m) => {
            m.seed();
          })
    )
  );
})();
