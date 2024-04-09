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
      me: async (_, { userId }, context) => {
        return getSingleUser(userId);
      },
    },
    Mutation: {
      createUser: async (_, args) => {
        return createNewUser(args);
      },
      saveBook: async (_, { user, book }, context) => {
        return saveBook({ user, book });
      },
      deleteBook: async (_, { bookId }, context) => {
        if (!context.user) {
          throw new AuthenticationError();
        }
        return deleteBook({ user: context.user, bookId });
      },
      login: async (_, args) => {
        return login(args);
      },
    },
  };
  
  module.exports = resolvers;
  
  