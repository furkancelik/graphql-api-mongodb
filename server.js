const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ApolloServer, AuthenticationError } = require("apollo-server-express");
const { loadFilesAsync } = require("@graphql-toolkit/file-loading");
const { join, basename, extname, parse } = require("path");
const { graphqlUploadExpress } = require("graphql-upload");
const globby = require("globby");

// const mongoose = require("mongoose");
const mongoose = require("./lib/db");
const Token = require("./lib/Token");
const {
  mergeTypeDefs,
  mergeResolvers,
} = require("@graphql-toolkit/schema-merging");

const app = express();
const dotenv = require("dotenv");
dotenv.config();
const dataLoaders = require("./dataLoaders/index");

//Connect MongoDB
mongoose();
// mongoose.connect(process.env.DB_URI, { useNewUrlParser: true });

app.use(cors());
// app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

//Public Dir
app.use(express.static("public"));

(async () => {
  //Models
  let Models = {};
  const allModelsPath = await globby.sync(
    [
      join(__dirname, "models", "!(*Schema).js"),
      join(__dirname, "Packages", "**", "model", "!(*Schema).js"),
    ],
    {
      absolute: true,
    }
  );

  await Promise.all(
    allModelsPath.map(
      async (path) =>
        await import(path)
          .then((m) => m.default || m)
          .then((m) => {
            Models = { ...Models, [parse(basename(path)).name]: m };
          })
    )
  );

  const [typeDefs, resolvers] = await Promise.all([
    loadFilesAsync(join(__dirname, "graphql", "**", "*.graphql")).then(
      mergeTypeDefs
    ),
    loadFilesAsync(join(__dirname, "graphql", "**", "*.js")).then(
      mergeResolvers
    ),
  ]);

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      let user = null;
      const token = req.headers.authorization || "";

      if (token && token !== "null") {
        user = await Token.verify(token);
        if (!user) throw new AuthenticationError("You must be logged in!");
      }
      return {
        ...Models,
        activeUser: user,
        dataLoaders: dataLoaders(),
      };
    },
    tracing: true,
    formatError: (err) => {
      return new Error(err.message.toString());
    },
  });

  server.applyMiddleware({ app });
  app.listen({ port: process.env.PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${process.env.PORT}${server.graphqlPath}`
    )
  );
})();
