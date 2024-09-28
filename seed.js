import mongoose from "mongoose";
import axios from "axios";
import Art from "./Models/art.model.js";
import dotenv from "dotenv";

dotenv.config();

//Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    throw err;
  });

// Fetch art from The Met Museum
async function fetchMetArt() {
  try {
    await Art.deleteMany({});
    const { data: objectIdsData } = await axios.get(
      "https://collectionapi.metmuseum.org/public/collection/v1/objects"
    );
    const objectIds = objectIdsData.objectIDs.slice(0, 150);

    for (let objectId of objectIds) {
      try {
        const { data: artData } = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
        );

        const artwork = {
          artId: artData.objectID.toString(),
          title: artData.title.toUpperCase(),
          artist: artData.artistDisplayName.toUpperCase() || "Unknown",
          description: artData.creditLine || "No description available",
          date: artData.objectDate || "Unknown",
          medium: artData.medium || "Unknown",
          dimensions: artData.dimensions || "Unknown",
          culture: artData.culture || "Unknown",
          period: artData.period || "Unknown",
          imageUrl:
            artData.primaryImage ||
            "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image",
          museum: "The Metropolitan Museum of Art",
        };

        const newArt = new Art(artwork);
        await newArt.save();
      } catch (error) {
        console.error(
          `Error fetching Metropolitan artwork with ID: ${objectId}`,
          error.message
        );
      }
    }

    console.log("Metropolitan artwork saved");
  } catch (error) {
    console.error("Error fetching Metropolitan artwork", error.message);
  }
}

//Fetch art from Harvard Art Museum
const API = process.env.API;
async function fetchHarvardMuseumArt() {
  try {
    const { data: objectData } = await axios.get(
      `https://api.harvardartmuseums.org/object?apikey=${API}&size=150`
    );
    const artworks = objectData.records.map((object) => ({
      artId: object.objectnumber,
      title: object.title,
      artist: object.people?.[0]?.name || "Unknown",
      description: object.creditline || "No description available",
      date: object.dated || "Unknown",
      medium: object.medium || "Unknown",
      dimensions: object.dimensions || "Unknown",
      culture: object.culture || "Unknown",
      imageUrl:
        object.primaryimageurl ||
        "https://dummyimage.com/150x150/cccccc/ffffff&text=No+Image",
      museum: "Harvard Art Museums",
    }));

    for (let artwork of artworks) {
      const newArt = new Art(artwork);
      await newArt.save();
    }
    console.log("Harvard artwork saved");
  } catch (error) {
    console.error(`Error fetching Harvard artwork`, error.message);
  }
}

//Seed the database
async function seedDatabase() {
  try {
    await fetchMetArt();
    await fetchHarvardMuseumArt();
  } catch (error) {
    console.error("Error seeding the database", error.message);
  } finally {
    mongoose.connection.close();
  }
}
seedDatabase();
