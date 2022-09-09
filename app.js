const express = require("express");

const {
  getApi,
  getTopics,
  getArticlesById,
  getUsers,
  patchArticlesById,
  getArticlesByIdComment,
  getArticlesByTopic,

  getCommentsByArtId,
  postCommentsByArtId,

} = require("./controllers/news");

const app = express();
app.use(express.json());


app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/users", getUsers);
app.patch("/api/articles/:article_id", patchArticlesById);
app.get("/api/articles/:article_id", getArticlesByIdComment);
app.get("/api/articles", getArticlesByTopic);
app.get("/api/articles/:article_id/comments", getCommentsByArtId);
app.post("/api/articles/:article_id/comments", postCommentsByArtId);


// below lines will catch all the unmatch endpoints
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use((err, req, res, next) => {
  // handle specific psql errors
  if (err.code === "22P02") {
    res.status(400).send({ msg: err.message || "Bad Request" });
  } else if (err.status && err.msg) {
    
    res.status(err.status).send({ msg: err.msg });
  } else {
    // respond with an internal server error
    res.status(500).send({ msg: "Internal Server Error" });
  }
});

//app.use((err, req, res, next) => {
//  res.status(500).send("Internal server error!");
//});

module.exports = app;
