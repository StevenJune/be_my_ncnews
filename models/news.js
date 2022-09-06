const db = require("../db/connection.js"); // get the connection string

exports.selectAllTopics = () => {
  return db.query("select * from topics").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticleById = (article_id) => {
    return db.query("select * from articles where article_id = $1",[article_id])
    //.then((article) => {
        //return article.rows[0];
    //})
    .then(({ rows }) => {
        
        const article = rows[0];
        if (!article) {
          return Promise.reject({
            status: 400,
            msg: `No article found for article_id: ${article_id}`,
          });
        }
        return article;
      });
   
}
