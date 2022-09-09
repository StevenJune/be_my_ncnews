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
  const qryparam = [];
  let str1 =
    "select article_id,title,topic,author,body,created_at,votes,count(*) as comment_count " +
    "from (select a.*,b.article_id as b_article_id from articles a left join " +
    "comments b on a.article_id = b.article_id ) as x " +
    "group by article_id,title,topic,author,body,created_at,votes ";
  if (topic) {
    str1 += "having topic = $1 ";
    qryparam.push(topic);
  }
  str1 += " order by created_at desc ";

  return db
    .query("select * from topics where slug = $1", [topic])
    .then(({ rows }) => {
      const result = rows[0];
      if (!result) {
        return Promise.reject({
          status: 404,
          msg: `Topic table not found for topic : ${topic}`,
        });
      }
      return topic;
    })
    .then((topic) => {
      return db.query("select * from articles where topic = $1", [topic]);
    })
    .then(({ rows }) => {
      const result = rows[0];
      if (!result) {
        return Promise.reject({
          status: 200,
          msg: `Topic that exists but has no articles : ${topic}`,
        });
      }
      return topic;
    })
    .then((topic) => {
      return db.query(str1, qryparam);
    })
    .then(({ rows }) => {
      const article = rows[0];
      if (!article) {
        return Promise.reject({ status: 404, msg: `No article found` });
      }
      return rows;
    });
};

exports.selectCommentsByArtId = (article_id) => {
  return db
    .query(
      "select * from articles where article_id = $1 and " +
        "article_id not in (select article_id from comments) ",
      [article_id]
    )
    .then(({ rows }) => {
      const result = rows[0];
      if (result) {
        return Promise.reject({
          status: 400,
          msg: `the article id exists, but there are no comments : ${article_id}`,
        });
      }
      return article_id;
    })
    .then((article_id) => {
      return db
        .query("select * from comments where article_id = $1", [article_id])
        .then(({ rows }) => {
          const comment = rows[0];
          if (!comment) {
            return Promise.reject({
              status: 404,
              msg: `No comments found for this article_id: ${article_id}`,
            });
          }
          return rows;
        });
    });
};

exports.insertCommentByArtid = (newComment) => {
  const { body, article_id,username } = newComment;

  return db
    .query("select * from articles where article_id = $1", [article_id])
    .then(({ rows }) => {
      const result = rows[0];
      if (!result) {
        return Promise.reject({
          status: 404,
          msg: `Articles table not found for this article_id : ${article_id}`,
        });
      }
      return username;
    })
    .then((username) => {
      return db.query("select * from users where username = $1", [username]);
    })
    .then(({ rows }) => {
      const result = rows[0];
      //console.log('control 01');
      if (!result) {
        return Promise.reject({
          status: 404,
          msg: `Users table not found for this username : ${username}`,
        });
      }
      return newComment;
    })
    .then((newComment) => {
      const { username, body, article_id } = newComment;
      const qryparam = [body, article_id, username]
      const str1 = "insert into comments (body, article_id,author) values ($1,$2,$3) returning *"
      return db.query(str1, qryparam);
    })
    .then(({ rows }) => {
      const comment = rows[0];
      if (!comment) {
        return Promise.reject({ status: 500, msg: `Cannot post comment call IT supports` });
      }
      return rows;
    });
};
