const {
  selectAllTopics,
  selectArticleById,
  selectAllUsers,
  updateArticleById,
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
  //console.log("inside the patch content");
  const article_id = req.params.article_id;
  let body = "";
  req.on("data", (packet) => {
    body += packet.toString();
  });
  req.on("end", () => {
    let amendArticle = JSON.parse(body);
    //console.log(amendArticle,'<<<<1')
    //if (Object, keys(amendArticle).length === 0) {
    //    console.log(amendArticle,'<<<<2')
    //    res.status(400).send({msg: 'No post field!'});
    //} else
     if (!amendArticle.inc_votes) {
        res.status(400).send({msg: 'post key field should have inc_votes'})  
    } else {
        amendArticle.article_id = article_id;
        updateArticleById(amendArticle)
          .then((article) => {
                    res.status(201).send({ article });
                })
          .catch(next);      
    }
  });
};



exports.getArticlesByIdComment = (req, res, next) => {
    const article_id = req.params.article_id;
    selectArticleByIdComment(article_id)
      .then((article) => {
        res.status(200).send({ article });
      })
      .catch(next);
  };
  
exports.getArticlesByTopic = (req,res,next) => {
    const myArg = req.params.topic
    console.log(myArg,'<<<myArg in controller')
    //const article_id = req.params.article_id;
    //const topic = req.params.topic;
    searchArticlesByTopic(myArg)
      .then((articles)=>{
        res.status(200).send({articles})
      .catch(next);  
    })
    
  } 


