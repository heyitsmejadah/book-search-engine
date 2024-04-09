const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {
  async getSingleUser(req, res) {
  
    const foundUser = await User.findById(req);

    if (!foundUser) {
      throw new Error('User not found');
    }
  
    return foundUser;
  },

  async createNewUser(req, res) {

    const user = await User.create(req);

    if (!user) {
      throw new Error('User not created!');
    }
    const token = signToken({ email: user.email, name: user.username, _id: user._id });
    return { token, user };
  },

  async login(req, res) {
    const user = await User.findOne({email: req.email})
    if (!user) {
      throw new Error('User not found!');
    }

    const correctPw = await user.isCorrectPassword(req.password);

    if (!correctPw) {
      throw new Error('Incorrect credentials');
    }
    const token = signToken({ email: user.email, name: user.username, _id: user._id });
    return { token, user };
  },

  async saveBook({ user, book }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    } catch (err) {
      throw new Error('Could not save book!');
    }
  },
  async deleteBook({ user, bookId }, res) {
    const updatedUser = await User.findOneAndUpdate(
      { _id: user },
      { $pull: { savedBooks: { bookId: bookId } } },
      { new: true }
    );
    if (!updatedUser) {
      throw new Error('Could not delete book');
    }
    return updatedUser;
  },
};