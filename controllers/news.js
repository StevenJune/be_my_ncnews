const {
  selectAllTopics,
  selectArticleById,
  selectAllUsers,
  updateArticleById,
  selectArticleByIdComment,
  searchArticlesByTopic,
  selectCommentsByArtId,
  insertCommentByArtid,

} = require("../models/news.js");

exports.getApi = (req, res) => {
  res.status(200).send({ message: "all ok" });
};

exports.getTopics = (req, res, next) => {
  selectAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticlesById = (req, res, next) => {
  const article_id = req.params.article_id;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getUsers = (req, res, next) => {
  selectAllUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticlesById = (req, res, next) => {
  const article_id = req.params.article_id;
  const amendArticle = req.body
    if (!amendArticle.inc_votes) {
      res.status(400).send({ msg: "post key field should have inc_votes" });
    } else if (Number.isInteger(amendArticle.inc_votes) === false) {
      res.status(400).send({ msg: "invalid value of inc_votes" });
    } else {
      amendArticle.article_id = article_id;
      updateArticleById(amendArticle)
        .then((article) => {
          res.status(201).send({ article });
        })
        .catch(next);
    }
};

exports.getArticlesByIdComment = (req, res, next) => {
  const article_id = req.params.article_id;
  selectArticleByIdComment(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticlesByTopic = (req, res, next) => {
  const myArg = req.query.topic;
  searchArticlesByTopic(myArg)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

exports.getCommentsByArtId = (req, res, next) => {
  const article_id = req.params.article_id;
  selectCommentsByArtId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.postCommentsByArtId = (req, res, next) => {
    const newComment = req.body
    newComment.article_id = req.params.article_id;
    insertCommentByArtid(newComment)
      .then((comment) => {
        res.status(201).send({ comment });
      })
      .catch(next);

};

