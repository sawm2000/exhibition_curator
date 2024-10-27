import { createError } from "../error.js";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const API = process.env.API;
const SAPI = process.env.SAPI;

export const search = async (req, res, next) => {
  try {
    const { search, sortBy = "title", orderBy = "asc" } = req.query;
    let { limit = 10, page = 1 } = req.query;

    const smithsonianAPI = `https://api.si.edu/openaccess/api/v1.0/search?q=${search}&api_key=${SAPI}`;
    const harvardMuseumAPI = `https://api.harvardartmuseums.org/object?apikey=${API}&q=title:${search}`;

    const [smithsonianResponse, harvardResponse] = await Promise.all([
      axios.get(smithsonianAPI),
      axios.get(harvardMuseumAPI),
    ]);

    const smithsonianArtworks = (
      smithsonianResponse.data.response.rows || []
    ).map((item) => ({
      artId: item.id,
      title: item.title || "Untitled",
      artist: item.content?.freetext?.name?.[0]?.content || "Unknown",
      description:
        item.content?.descriptiveNonRepeating?.notes ||
        "No description available",
      date: item.content?.indexedStructured?.date || "Unknown",
      medium: item.content?.indexedStructured?.material || "Unknown",
      dimensions:
        item.content?.indexedStructured?.physicalDescription || "Unknown",
      culture: item.content?.indexedStructured?.culture || "Unknown",
      period:  item.content?.indexedStructured?.period || "Unknown",
      imageUrl:
        item.content?.descriptiveNonRepeating?.online_media?.media?.[0]
          ?.content ||
        "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image",
      museum: "Smithsonian Institution",
    }));

    const harvardArtworks = (harvardResponse.data.records || []).map(
      (object) => ({
        artId: object.objectid.toString(),
        title: object.title || "Untitled",
        artist: object.people?.[0]?.name || "Unknown",
        description: object.creditline || "No description available",
        date: object.dated || "Unknown",
        medium: object.medium || "Unknown",
        dimensions: object.dimensions || "Unknown",
        culture: object.culture || "Unknown",
        period: object.period || "Unknown",
        imageUrl:
          object.primaryimageurl ||
          "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image",
        museum: "Harvard Art Museums",
      })
    );

    const combinedResults = [...smithsonianArtworks, ...harvardArtworks];

    combinedResults.sort((a, b) => {
      if (orderBy === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });

    const start = (page - 1) * limit;
    const paginatedResults = combinedResults.slice(start, start + limit);

    res.status(200).json(paginatedResults);
  } catch (err) {
    next(err);
  }
};

export const viewArtPiece = async (req, res, next) => {
  try {
    const { artId } = req.params;

    const smithsonianAPI = `https://api.si.edu/openaccess/api/v1.0/content/${artId}?api_key=${SAPI}`;
    const harvardAPI = `https://api.harvardartmuseums.org/object/${artId}?apikey=${API}`;

    let artwork;

    try {
      const smithsonianResponse = await axios.get(smithsonianAPI);
      if (
        smithsonianResponse.data.response &&
        smithsonianResponse.data.response.content
      ) {
        const item = smithsonianResponse.data.response;
        const content = item.content;

        artwork = {
          artId: item.id,
          title: item.title || "Untitled",
          artist: item.content?.freetext?.name?.[0]?.content || "Unknown",
          description:
            item.content?.descriptiveNonRepeating?.notes ||
            "No description available",
          date: item.content?.indexedStructured?.date || "Unknown",
          medium: item.content?.indexedStructured?.material || "Unknown",
          dimensions:
            item.content?.indexedStructured?.physicalDescription || "Unknown",
          culture: item.content?.indexedStructured?.culture || "Unknown",
          period:  item.content?.indexedStructured?.period || "Unknown",
          imageUrl:
            item.content?.descriptiveNonRepeating?.online_media?.media?.[0]
              ?.content ||
            "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image",
          museum: "Smithsonian Institution",
        };
      }
    } catch (error) {}

    if (!artwork) {
      try {
        const harvardResponse = await axios.get(harvardAPI);
        const object = harvardResponse.data;

        if (object) {
          artwork = {
            artId: object.objectid.toString(),
            title: object.title || "Untitled",
            artist: object.people?.[0]?.name || "Unknown",
            description: object.creditline || "No description available",
            date: object.dated || "Unknown",
            medium: object.medium || "Unknown",
            dimensions: object.dimensions || "Unknown",
            culture: object.culture || "Unknown",
            period: object.period || "Unknown",
            imageUrl:
              object.primaryimageurl ||
              "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image",
            museum: "Harvard Art Museums",
          };
        }
      } catch (error) {}
    }

    if (!artwork) {
      return next(createError(404, "Artwork not found"));
    }

    res.status(200).json(artwork);
  } catch (err) {
    next(err);
  }
};

export const viewAllArt = async (req, res, next) => {

  try {
    const { sortBy = "title", orderBy = "asc" } = req.query;
    let { limit = 10, page = 1 } = req.query;
    
    const smithsonianAPI = `https://api.si.edu/openaccess/api/v1.0/search?q=*:*&api_key=${SAPI}`;
    const smithsonianResponse = await axios.get(smithsonianAPI);
    const smithsonianArtworks = (
      smithsonianResponse.data.response.rows || []
    ).map((item) => ({
      artId: item.id,
          title: item.title || "Untitled",
          artist: item.content?.freetext?.name?.[0]?.content || "Unknown",
          description:
            item.content?.descriptiveNonRepeating?.notes ||
            "No description available",
          date: item.content?.indexedStructured?.date || "Unknown",
          medium: item.content?.indexedStructured?.material || "Unknown",
          dimensions:
            item.content?.indexedStructured?.physicalDescription || "Unknown",
          culture: item.content?.indexedStructured?.culture || "Unknown",
          period:  item.content?.indexedStructured?.period || "Unknown",
          imageUrl:
            item.content?.descriptiveNonRepeating?.online_media?.media?.[0]
              ?.content ||
            "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image",
          museum: "Smithsonian Institution",
    }));

    const harvardAPI = `https://api.harvardartmuseums.org/object?apikey=${API}`;
    const harvardResponse = await axios.get(harvardAPI);
    const harvardArtworks = (harvardResponse.data.records || []).map((object) => ({
      artId: object.objectid.toString(),
      title: object.title || "Untitled",
      artist: object.people?.[0]?.name || "Unknown",
      description: object.creditline || "No description available",
      date: object.dated || "Unknown",
      medium: object.medium || "Unknown",
      dimensions: object.dimensions || "Unknown",
      culture: object.culture || "Unknown",
      period: object.period || "Unknown",
      imageUrl:
        object.primaryimageurl ||
        "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image",
      museum: "Harvard Art Museums",
    }));

    const combinedResults = [...smithsonianArtworks, ...harvardArtworks];
    combinedResults.sort((a, b) => {
      if (orderBy === "asc") return a[sortBy] > b[sortBy] ? 1 : -1;
      return a[sortBy] < b[sortBy] ? 1 : -1;
    });

    const start = (page - 1) * limit;
    const paginatedResults = combinedResults.slice(start, start + limit);

    res.status(200).json(paginatedResults);
  } catch (err) {
    console.error("Error fetching all artwork", err);
    next(err);
}
}