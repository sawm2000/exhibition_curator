import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import { createError } from "../error.js";

//signup controller
export const signup = async (req, res, next) => {
  try {
    const userExists = await User.findOne({ username: req.body.username });
    if (userExists) {
      return next(createError(400, "Username already exists"));
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    const newUser = new User({ ...req.body, password: hash });

    await newUser.save();
    res.status(200).send("User has been created");
  } catch (err) {
    next(err);
  }
};

//signin controller
export const signin = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));

    const isCorrect = await bcrypt.compare(req.body.password, user.password);

    if (!isCorrect) return next(createError(400, "Wrong Credentials"));

    const { password, ...others } = user._doc;

    res.status(200).json(others);
  } catch (err) {
    next(err);
  }
};
