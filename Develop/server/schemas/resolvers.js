const {
    createNewUser,
    getSingleUser,
    saveBook,
    deleteBook,
    login,
  } = require('../controllers/user-controller');
  
  const { AuthenticationError } = require('../utils/auth');
  
  const resolvers = {
    Query: {
      me: async (_, __, context) => {
        // Check if the user is authenticated
        if (!context.user) {
          throw new AuthenticationError();
        }
        // Call the getSingleUser function from your controller
        return getSingleUser({ user: context.user }, null);
      },
    },
    Mutation: {
      createUser: async (_, args) => {
        return createNewUser(args);
      },
      saveBook: async (_, { input }, context) => {
        // Check if the user is authenticated
        if (!context.user) {
          throw new AuthenticationError();
        }
        // Call the saveBook function from your controller
        return saveBook({ user: context.user, body: input });
      },
      deleteBook: async (_, { bookId }, context) => {
        // Check if the user is authenticated
        if (!context.user) {
          throw new AuthenticationError();
        }
        // Call the deleteBook function from your controller
        return deleteBook({ user: context.user, params: { bookId } });
      },
      login: async (_, args) => {
        return login(args);
      },
    },
  };
  
  module.exports = resolvers;
  