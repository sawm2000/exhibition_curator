import Art from "../Models/art.model.js";
import { createError } from "../error.js";

export const search = async (req, res, next) => {
  try {
    const { search, sortBy = "title", orderBy = "asc" } = req.query;
    let { limit = 10, page = 1 } = req.query;

    let query = {};
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { artist: { $regex: search, $options: "i" } },
        ],
      };
    }

    const art = await Art.find(query)
      .sort({ [sortBy]: orderBy === "desc" ? -1 : 1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(art);
  } catch (err) {
    next(err);
  }
};

export const viewArtPiece = async (req, res, next) => {
  try {
    const { artId } = req.params;
    const artwork = await Art.findById(artId);

    if (!artwork) {
      return next(createError(404, "Artwork not found"));
    }

    res.status(200).json(artwork);
  } catch (err) {
    next(err);
  }
};
