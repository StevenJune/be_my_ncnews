const express = require("express");

const { getApi, getTopics, getArticlesById } = require("./controllers/news");

const app = express();

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById);

// below lines will catch all the unmatch endpoints
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found"    });
});

app.use((err, req, res, next) => {
  // handle specific psql errors
  if (err.code === "22P02") {
    res.status(400).send({ msg: err.message || "Bad Request" });
  } else if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  }
  // handle specific psql errors
  else {
    // respond with an internal server error
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send("Internal server error");
});

module.exports = app;
