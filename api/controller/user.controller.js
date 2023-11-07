import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';



export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, "You are not allowed to update this account"))
  try {
    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10)
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      }
      
    }, { new: true })
    const { password, ...others } = updatedUser._doc
    res.status(200).json(others)
  } catch (err) {
    next(err)
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, "You are not allowed to delete this account"))
  try {
    await User.findByIdAndDelete(req.params.id)
    res.clearCookie("access_token");
    res.status(200).json("User has been deleted");
  } catch (err) {
    next(err)
  }
}
export const sinOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
  res.status(200).json("User has been logged out!");
  } catch (err) {
    next(err)
  }
}
export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (err) {
      next(err);
    }
  } else {
    return next(errorHandler(401, 'You can see your own list'));
  }
};
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) 
      return next(errorHandler(404, "User not found"));
    const { password: pass, ...others } = user._doc;
      res.status(200).json(others);

    
  } catch (err) {
    next(err);
  }
};


