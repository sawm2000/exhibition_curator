import User from "../Models/user.model.js";
import { createError } from "../error.js";
import bcrypt from "bcryptjs";

//update user
export const updateUser = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      return next(createError(400, "Username already exists"));
    }
    const { password, ...otherInfo } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: otherInfo,
      },
      { new: true }
    );

    if (password) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(req.body.password, salt);

      updatedUser.password = hash;
      await updatedUser.save();
    }

    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

//delete user
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted");
  } catch (err) {
    next(err);
  }
};

//get user
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

//like artwork
export const likeArt = async (req, res, next) => {
  try {
    const { id, artId } = req.params;

    const user = await User.findById(id);

    if (user.likes.includes(artId)) {
      return next(createError(400, "Artwork already liked"));
    }
    user.likes.push(artId);
    await user.save();

    res.status(200).json({ message: "Artwork liked" });
  } catch (err) {
    next(err);
  }
};

//add to collection
export const addToCollection = async (req, res, next) => {
  const { collectionName } = req.body;
  const { id, artId } = req.params;

  try {
    const user = await User.findById(id);

    const collection = user.collections.find(
      (col) => col.collectionName === collectionName
    );

    if (collection) {
      if (artId && !collection.artworks.includes(artId)) {
        collection.artworks.push(artId);
        await user.save();
        return res.status(200).json({ message: "Artwork added to collection" });
      } else {
        return next(createError(400, "Artwork already in collection"));
      }
    } else {
      user.collections.push({ collectionName, artworks: [artId] });
      await user.save();
      res.status(200).json({ message: "New collection created" });
    }
  } catch (err) {
    next(err);
  }
};

//unlike
export const unlike = async (req, res, next) => {
  const { id, artId } = req.params;

  try {
    const user = await User.findById(id);

    user.likes = user.likes.filter(
      (likedArtId) => likedArtId.toString() !== artId.toString()
    );
    await user.save();

    res.status(200).json({ message: "Artwork unliked" });
  } catch (err) {
    next(err);
  }
};

//remove artwork from collection
export const deleteFromCollection = async (req, res, next) => {
  const { id, collectionName, artId } = req.params;

  try {
    const user = await User.findById(id);
    const collection = user.collections.find(
      (col) => col.collectionName === collectionName
    );

    if (!collection) {
      return next(createError(404, "Collection not found"));
    }

    if (!collection.artworks.includes(artId)) {
      return next(createError(400, "Artwork not found in this collection"));
    }

    collection.artworks = collection.artworks.filter(
      (art) => art.toString() !== artId.toString()
    );
    await user.save();

    res.status(200).json({ message: "Artwork removed from collection" });
  } catch (err) {
    next(err);
  }
};

//delete collection
export const deleteCollection = async (req, res, next) => {
  const { id, collectionName } = req.params;

  try {
    const user = await User.findById(id);
    const collectionIndex = user.collections.findIndex(
      (col) => col.collectionName === collectionName
    );

    if (collectionIndex === -1) {
      return next(createError(404, "Collection not found"));
    }

    user.collections.splice(collectionIndex, 1);
    await user.save();

    res.status(200).json({ message: "Collection deleted" });
  } catch (err) {
    next(err);
  }
};

//view likes
export const viewLikes = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).populate("likes");
    res.status(200).json(user.likes);
  } catch (err) {
    next(err);
  }
};

//view collections
export const viewCollections = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user.collections);
  } catch (err) {
    next(err);
  }
};

//view single collection
export const viewSingleCollection = async (req, res, next) => {
  const { collectionName } = req.params;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const collection = user.collections.find(
      (col) => col.collectionName === collectionName
    );

    if (!collection) {
      return next(createError(400, "Collection not found"));
    }
    res.status(200).json(collection);
  } catch (err) {
    next(err);
  }
};
