\c nc_news
select * from topics;
select * from comments;
select * from users;
select * from articles;
select article_id,title,topic,author,body,created_at,votes,count(*) as comment_count from 
(select a.*,b.article_id as b_article_id from articles a left join 
                                              comments b on a.article_id = b.article_id ) as x 
group by article_id,title,topic,author,body,created_at,votes
having topic = 'coding'
order by created_at desc

--\c nc_news_test
--select * from topics;
--select * from comments;
--select * from users;
--select * from articles;
--article_id     title  topic   |    author  body   created_at      | votes 

--    body: "Nobis consequatur animi. Ullam nobis quaerat voluptates veniam.",
--    votes: 7,
--    author: "grumpy19",
--    article_id: 4,
--    created_at