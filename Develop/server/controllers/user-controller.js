const { User } = require('../models');
const { signToken } = require('../utils/auth');

module.exports = {

  async getSingleUser(req, res) {
    try {
      const foundUser = await User.findById(req);

      if (!foundUser) {
        throw new Error('User not found');
      }

      console.log(foundUser);
      return foundUser;
    } catch (err) {
      console.error(err);
      throw new Error('Error fetching user');
    }
  },

  async createNewUser(req, res) {
    try {
      console.log(`body: ${req.username}, ${req.email}, ${req.password}`);
      const user = await User.create(req);
      
      if (!user) {
        throw new Error('User not created!');
      }
      
      const token = signToken({ email: user.email, name: user.username, _id: user._id });
      
      return { token, user };
    } catch (err) {
      console.error(err);
      throw new Error('Error creating user');
    }
  },
 
  async login({ body }, res) {
    try {
      const user = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] });

      if (!user) {
        return res.status(400).json({ message: "Can't find this user" });
      }

      const correctPw = await user.isCorrectPassword(body.password);

      if (!correctPw) {
        return res.status(400).json({ message: 'Wrong password!' });
      }

      const token = signToken(user);
      res.json({ token, user });
    } catch (err) {
      console.error(err);
      throw new Error('Error logging in');
    }
  },

  async saveBook({ user, book }, res) {
    try {
      console.log(user);
      const updatedUser = await User.findOneAndUpdate(
        { _id: user },
        { $addToSet: { savedBooks: book } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    } catch (err) {
      console.error(err);
      throw new Error('Could not save book!');
    }
  },
  async deleteBook({ user, params }, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        { $pull: { savedBooks: { bookId: params.bookId } } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "Couldn't find user with this id!" });
      }

      return updatedUser;
    } catch (err) {
      console.error(err);
      throw new Error('Error deleting book');
    }
  },
};
