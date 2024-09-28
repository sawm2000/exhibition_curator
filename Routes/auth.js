import express from "express";
import { signup, signin } from "../Controllers/auth.controller.js";

const router = express.Router();

//Create user
router.post("/signup", signup);

//Sign in
router.post("/signin", signin);

export default router;
