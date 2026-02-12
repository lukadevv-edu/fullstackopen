import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { makeExecutableSchema } from "@graphql-tools/schema";
import express from "express";
import http from "http";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { expressMiddleware } from "@as-integrations/express5";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import Book from "./models/Book.js";
import Author from "./models/Author.js";
import User from "./models/User.js";

const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log("connected to MongoDB");

    const favoriteGenre = "refactoring";

    let rootUser = await User.findOne({ username: "admin" });

    if (!rootUser) {
      rootUser = new User({
        username: "admin",
        favoriteGenre: favoriteGenre,
      });
      await rootUser.save();
    }
  })
  .catch((error) => console.log("error:", error.message));

const typeDefs = `
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Book {
    id: ID!
    title: String!
    author: Author!
    genres: [String!]!
    published: Int!
  }
    
  type Author {
    id: ID!
    name: String!
    born: Int
    bookCount: Int!
  }

  type Query {
    me: User
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      genres: [String!]!
      published: Int!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(
      username: String!
      favoriteGenre: String!
    ): User
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`;

const pubsub = new PubSub();

const resolvers = {
  Query: {
    me: (__, _, context) => {
      return context.currentUser;
    },
    bookCount: async () => await Book.collection.countDocuments(),
    authorCount: async () => await Author.collection.countDocuments(),
    allBooks: async (_, args) => {
      const query = {};

      if (args?.author) {
        query.author = args.author;
      }

      if (args?.genre) {
        query.genres = args.genre;
      }

      return await Book.find(query);
    },
    allAuthors: async () => {
      const authors = await Author.find({});

      const counts = await Book.aggregate([
        {
          $group: {
            _id: "$author",
            count: { $sum: 1 },
          },
        },
      ]);

      const countMap = {};
      counts.forEach((each) => {
        countMap[each._id] = each.count;
      });

      return authors.map((each) => ({
        ...each.toObject(),
        id: each._id,
        bookCount: countMap[each.name] || 0,
      }));
    },
  },
  Mutation: {
    addBook: async (_, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      let author = await Author.findOne({ name: args.author });
      try {
        if (!author) {
          author = new Author({ name: args.author });
          await author.save();
        }
        const book = new Book({ ...args, author });
        const result = await book.save();

        pubsub.publish("BOOK_ADDED", {
          bookAdded: result,
        });

        return result;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },
    editAuthor: async (_, { name, setBornTo }, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const author = await Author.findOne({ name });
        if (!author) return null;

        author.born = setBornTo;
        return await author.save();
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: { name, setBornTo },
            error,
          },
        });
      }
    },
    createUser: async (_, args) => {
      const user = new User({ username: args.username });

      return user.save().catch((error) => {
        throw new GraphQLError("Creating the user failed", {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.name,
            error,
          },
        });
      });
    },
    login: async (_, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator("BOOK_ADDED"),
    },
  },
  Author: {
    bookCount: async (author) =>
      await Book.countDocuments({ author: author.id }),
  },
  Book: {
    author: async (book) => await Author.findById(book.author),
  },
};

const start = async () => {
  const app = express();
  const httpServer = http.createServer(app);
  const wsServer = new WebSocketServer({ server: httpServer, path: "/" });
  const schema = makeExecutableSchema({ typeDefs, resolvers });
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null;
        if (auth && auth.startsWith("Bearer ")) {
          const decodedToken = jwt.verify(
            auth.substring(7),
            process.env.JWT_SECRET,
          );
          const currentUser = await User.findById(decodedToken.id);
          return { currentUser };
        }
      },
    }),
  );

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server ready at http://localhost:${PORT}`);
  });
};

start();
