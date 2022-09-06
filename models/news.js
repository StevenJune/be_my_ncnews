const db = require("../db/connection.js"); // get the connection string

exports.selectAllTopics = () => {
  return db.query("select * from topics").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticleById = (article_id) => {
    return db.query("select * from articles where article_id = $1",[article_id]).then((article) => {
        return article.rows[0];
    })
}
