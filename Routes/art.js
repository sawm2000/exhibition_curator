import express from "express";
import { search, viewArtPiece } from "../Controllers/art.controller.js";

const router = express.Router();

//search and sort
router.get("/search", search);

//view an art piece
router.get("/:artId", viewArtPiece);

export default router;
