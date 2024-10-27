import express from "express";
import { search, viewArtPiece, viewAllArt } from "../Controllers/art.controller.js";

const router = express.Router();

//search and sort
router.get("/search", search);

//view an art piece
router.get("/:artId", viewArtPiece);

//view all art
router.get("/", viewAllArt);

export default router;
