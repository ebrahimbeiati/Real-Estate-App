import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";




export const createListing = async (req, res, next) => {
    try {
        const listing = await Listing.create(req.body);
      return  res.status(200).json(listing);
    } catch (err) {
        next(err);
    }
}
export const deleteListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return next(errorHandler(404, "Listing not found"))

    if (req.user.id !== listing.userRef) return next(errorHandler(401, "You are not allowed to delete this listing"))

    try {
    await Listing.findByIdAndDelete(req.params.id);
      return  res.status(200).json('listing has been deleted');
    } catch (err) {
        next(err);
    }
}

export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found!"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, "You can only update your own listings!"));
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedListing);
  } catch (error) {
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: "Invalid listing ID",
        });
    }
      next(error);
  }
}


export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, "Listing not found"));
    }
    return res.status(200).json(listing);
  } catch (err) {
    next(err);
  }
};
export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;
    if (offer === undefined || offer === 'false') {
      offer = {$in: [false, true]};
    }
    if (furnished === undefined || furnished === 'false') {
      furnished = {$in: [false, true]};
    }
    if (parking === undefined || parking === ' false') {
      parking = {$in: [false, true]};
    }
    let type = req.query.type;
    if (type === undefined|| type === 'all') {
      type = {$in: ['sale', 'rent']};
    }
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      title: { $regex: searchTerm, $options: 'i' },
      type,
      offer,
      parking,
      furnished,
    }).sort(
      { [sort]: order }
    ).limit(limit).skip(startIndex);
    return res.status(200).json(listings);

  }
  catch (err) {
    next(err);
  }
}