import express from "express";
import {
  updateUser,
  deleteUser,
  getUser,
  likeArt,
  addToCollection,
  unlike,
  deleteFromCollection,
  deleteCollection,
  viewLikes,
  viewCollections,
  viewSingleCollection,
} from "../Controllers/user.controller.js";

const router = express.Router();

//update user
router.put("/:id", updateUser);

//delete user
router.delete("/:id", deleteUser);

//get a user
router.get("/:id", getUser);

//like artwork
router.post("/:id/likes/:artId", likeArt);

//add to collection
router.post("/:id/collections/:artId", addToCollection);

//unlike
router.delete("/:id/likes/:artId", unlike);

//delete from collection
router.delete("/:id/collections/:collectionName/:artId", deleteFromCollection);

//delete collection
router.delete("/:id/collections/:collectionName", deleteCollection);

//view likes
router.get("/:id/likes", viewLikes);

//view collections
router.get("/:id/collections", viewCollections);

//view single collection
router.get("/:id/collections/:collectionName", viewSingleCollection);

export default router;
