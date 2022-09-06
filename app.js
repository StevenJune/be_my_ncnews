const express = require("express");

const { getApi, 
        getTopics, 
        getArticlesById,
       } = require("./controllers/news");

const app = express();

app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id",getArticlesById)

// below lines will catch all the unmatch endpoints
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

module.exports = app;
