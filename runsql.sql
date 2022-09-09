\c nc_news_test
select * from topics;
select * from comments;
select * from users;
select * from articles;
--select article_id,title,topic,author,body,created_at,votes,count(*) as comment_count from 
--(select a.*,b.article_id as b_article_id from articles a left join 
--                                              comments b on a.article_id = b.article_id ) as x 
--group by article_id,title,topic,author,body,created_at,votes
--having topic = 'coding'
--order by created_at desc

select article_id,title,topic,author,body,created_at,votes,count(*) as comment_count 
        from (select a.*,b.article_id as b_article_id from articles a left join 
        comments b on a.article_id = b.article_id ) as x 
        group by article_id,title,topic,author,body,created_at,votes 
        --"having article_id = $1
order by created_at desc        
 if (topic) {
    console.log("step 02");
    return db
      .query("select * from topics where slug = $1", [topic])
      .then(({ rows }) => {
        console.log("step 021");
        const result = rows[0];
        if (!result) {
          return Promise.reject({
            status: 404,
            msg: `Topic master not found for topic : ${topic}`,
          });
        }
        //return article;
      });
  }
  if (topic) {
    console.log("step 03");
    return db
      .query("select * from articles where topic = $1", [topic])
      .then(({ rows }) => {
        console.log("step 031");
        const result = rows[0];
        if (!result) {
          return Promise.reject({
            status: 200,
            msg: `topic that exists but has no articles : ${topic}`,
          });
        }
        //return article;
      });
  }
 