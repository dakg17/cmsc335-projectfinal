import express from "express";
import axios from "axios";
import Search from "../models/search.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/stats", (req, res) => {
  res.redirect("/");
});

router.post("/stats", async (req, res) => {
  const { userName, age, player } = req.body;

  const search = new Search({ userName, age, artist: player });
  await search.save();

  const searchOptions = {
    method: "GET",
    url: "https://spotify23.p.rapidapi.com/search/",
    params: {
      q: player,
      type: "artists",
      limit: "1"
    },
    headers: {
      "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
      "X-RapidAPI-Host": "spotify23.p.rapidapi.com"
    }
  };

  try {
    const searchResponse = await axios.request(searchOptions);

    if (searchResponse.data.artists.items.length === 0) {
      return res.send("Artist not found");
    }

    const artistId = searchResponse.data.artists.items[0].data.uri.split(':')[2];

    const overviewOptions = {
      method: "GET",
      url: "https://spotify23.p.rapidapi.com/artist_overview/",
      params: { id: artistId },
      headers: {
        "X-RapidAPI-Key": process.env.RAPIDAPI_KEY,
        "X-RapidAPI-Host": "spotify23.p.rapidapi.com"
      }
    };

    const overviewResponse = await axios.request(overviewOptions);
    const artistData = overviewResponse.data.data.artist;

    res.render("results", {
      userName,
      artist: artistData
    });

  } catch (err) {
    console.error(err);
    res.send("Error fetching artist data");
  }
});

router.get("/history", async (req, res) => {
  const searches = await Search.find().sort({ createdAt: -1 });
  res.render("history", { searches });
});

router.post("/processAdminRemove", async (req, res) => {
  const result = await Search.deleteMany({});
  res.render("removedApplicants", { number: result.deletedCount })
});

export default router;
