import dotenv from "dotenv";
dotenv.config();
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import Book from "./models/Book.js";
import Author from "./models/Author.js";
import User from "./models/User.js";
import { GraphQLError } from "graphql";
import jwt from "jsonwebtoken";

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

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
      console.log(
        "'admin' user was created with favorite genre:",
        favoriteGenre,
      );
    }

    const bookExists = await Book.exists({ title: "Refactoring" });

    if (!bookExists) {
      let author = await Author.findOne({ name: "Martin Fowler" });
      if (!author) {
        author = new Author({ name: "Martin Fowler" });
        await author.save();
      }

      const book = new Book({
        title: "Refactoring",
        published: 1999,
        author: author._id,
        genres: [favoriteGenre, "software engineering"],
      });

      await book.save();
      console.log("Sample book created to match user's favorite genre");
    }
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

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
`;

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
      return await Author.find({});
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
        await book.save();
        return book;
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
  Author: {
    bookCount: async (author) =>
      await Book.countDocuments({ author: author.id }),
  },
  Book: {
    author: async (book) => await Author.findById(book.author),
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
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
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
