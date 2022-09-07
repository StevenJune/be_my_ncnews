const db = require("../db/connection.js"); // get the connection string

exports.selectAllTopics = () => {
  return db.query("select * from topics").then((topics) => {
    return topics.rows;
  });
};

exports.selectArticleById = (article_id) => {
  return db
    .query("select * from articles where article_id = $1", [article_id])
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
};

exports.selectAllUsers = () => {
  return db.query("select * from users").then((users) => {
    return users.rows;
  });
};

exports.updateArticleById = (amendArticle) => {
  const { article_id, inc_votes } = amendArticle;
  return db
    .query(
      "update articles set votes = votes + $2 where article_id = $1 returning *",
      [article_id, inc_votes]
    )
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for updating votes in this article_id : ${article_id}`,
        });
      }
      return article;
    });
};

exports.selectArticleByIdComment = (article_id) => {
  return db
    .query(
      "select article_id,title,topic,author,body,created_at,votes,count(*) as comment_count " +
        "from (select a.*,b.article_id as b_article_id from articles a left join " +
        "comments b on a.article_id = b.article_id ) as x " +
        "group by article_id,title,topic,author,body,created_at,votes " +
        "having article_id = $1",
      [article_id]
    )
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
};

exports.searchArticlesByTopic = (topic) => {
  console.log(topic, "<<topic in model");
  let str1 =
    "select article_id,title,topic,author,body,created_at,votes,count(*) as comment_count " +
    "from (select a.*,b.article_id as b_article_id from articles a left join " +
    "comments b on a.article_id = b.article_id ) as x " +
    "group by article_id,title,topic,author,body,created_at,votes ";
  if (topic) {
    str1 += "having topic = $1 ";
  }
  str1 += " order by created_at desc ";
  console.log(str1, "<<<str1");
  return db.query(str1, [topic]).then(({ rows }) => {
    const article = rows[0];
    if (!article) {
      return Promise.reject({
        status: 400,
        msg: `No article found`,
      });
    }
    return article;
  });
};
