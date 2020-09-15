require("dotenv").config();
const express = require("express");
const movies = require("./movies");
const helmet = require('helmet')
const morgan = require("morgan");
const cors = require('cors');

//// create express server
const app = express();
app.use(morgan("dev"));
app.use(cors())
app.use(helmet())


app.use((req, res, next) => {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");
  console.log(authToken);
  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({error: 'unauthorized request'});
  }
  next()
});

app.get("/movie", (req, res) => {
  const { genre, country, avg_vote } = req.query;
  let results = [...movies];

  if (genre) {
    results = results.filter((movie) =>
      movie.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  if (country) {
    results = results.filter((movie) =>
      movie.country.toLowerCase().includes(country.toLowerCase())
    );
  }

  if (avg_vote) {
    results = results.filter(
      (movie) => Number(movie.avg_vote) >= Number(avg_vote)
    );
  }

  res.json(results);
});

app.listen(8000, () => {
  console.log("Server started on PORT 8000");
});
