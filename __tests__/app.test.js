const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("3. GET /api/topics", () => {
  test("status:200, responds with an array of topics objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
        expect(topics.length > 0).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
// the following is outdated, but kept it for later reference only :)
describe("4. GET /api/articles/:article_id", () => {
  test("status:200, responds with a single matching article", () => {
    const article_id = 2;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: article_id,
          title: "Sony Vaio; or, The Laptop",
          author: "icellusedkars",
          body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
          topic: "mitch",
          created_at: "2020-10-16T05:03:00.000Z",
          votes: 0,
          comment_count: "1",
        });
      });
  });

  test("status:400, article_id does not exist in table", () => {
    const article_id = 999;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`No article found for article_id: ${article_id}`);
      });
  });

  test("status:400, invalid article_id feed in", () => {
    const article_id = "banana";
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `invalid input syntax for type integer: "${article_id}"`
        );
      });
  });
});

describe("5. GET /api/users", () => {
  test("status:200, responds with an array of users objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users } = body;
        expect(users).toBeInstanceOf(Array);
        expect(users.length > 0).toBe(true);
        users.forEach((users) => {
          expect(users).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});

describe("6. PATCH /api/articles/:article_id", () => {
  it("status:201, responds with the updated article votes", () => {
    const votesCount = {
      inc_votes: 200,
    };
    return request(app)
      .patch("/api/articles/5")
      .send(votesCount)
      .expect(201)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 5,
          title: "UNCOVERED: catspiracy to bring down democracy",
          votes: 200,
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: "2020-08-03T13:14:00.000Z",
          topic: "cats",
        });
      });
  });

  it("status:400, responds with invalid post key", () => {
    const votesCount = {
      inc_xotes: 200,
    };
    return request(app)
      .patch("/api/articles/5")
      .send(votesCount)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`post key field should have inc_votes`);
      });
  });

  test("status:404, patch article_id does not exist in table", () => {
    const article_id = 999;
    const votesCount = {
      inc_votes: 200,
    };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(votesCount)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `No article found for updating votes in this article_id : ${article_id}`
        );
      });
  });

  test("status:400, invalid article_id feed in", () => {
    const article_id = "banana";
    const votesCount = {
      inc_votes: 200,
    };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(votesCount)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `invalid input syntax for type integer: "${article_id}"`
        );
      });
  });

  test("status:400, invalid value of inc_votes feed in", () => {
    const article_id = "banana";
    const votesCount = {
      inc_votes: "a2b0c0d",
    };
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(votesCount)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`invalid value of inc_votes`);
      });
  });
});

describe("7. GET /api/articles/:article_id", () => {
  test("status:200, responds with a single matching article with comment count", () => {
    const article_id = 3;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: article_id,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          body: "some gifs",
          created_at: "2020-11-03T09:12:00.000Z",
          votes: 0,
          comment_count: "2",
        });
      });
  });

  test("status:400, article_id does not exist in table", () => {
    const article_id = 999;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`No article found for article_id: ${article_id}`);
      });
  });

  test("status:400, invalid article_id feed in", () => {
    const article_id = "apple";
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `invalid input syntax for type integer: "${article_id}"`
        );
      });
  });
});

describe.only("8. GET /api/articles?topic=:topic,sortby=:sortBy,orderDirection=:orderDirection", () => {
  test("status:200, provide topic and responds with array of sorted articles", () => {
    const topic = "mitch";
    const sortBy = 'created_at'
    return request(app)
      .get(`/api/articles?topic=${topic}&sortBy=${sortBy}`) //${topic}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Object);
        expect(articles).toBeSortedBy(sortBy, { descending: true });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });
  //});

  test("status:200, topic that exists but has no articles", () => {
    const topic = "paper";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `Topic that exists but has no articles : ${topic}`
        );
      });
  });

  test("status:404, Topic master not found for this topic", () => {
    const topic = "unknown";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(`Topic table not found for topic : ${topic}`);
      });
  });

  test("status:400, Incorrect sorting column input", () => {
    const topic = "unknown";
    const sortBy = "unknownCol"
    return request(app)
      .get(`/api/articles?topic=${topic}&sortBy=${sortBy}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`please only "sortBy=" 'author';'title';'article_id';'topic';'created_at' and 'votes' for sorting items`);
      });
  });

  test("status:400, Either descending or ascending ordering", () => {
    const topic = "unknown";
    const orderDirection = "unknownOrderWay"
    return request(app)
      .get(`/api/articles?topic=${topic}&orderDirection=${orderDirection}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(`please "order=" either "desc" or "asc" ,Unknown sorting column`);
      });
  });

  test("status:200, provide topic and responds with assigned sorted title ascending", () => {
    const topic = "mitch";
    const sortBy = 'title'
    const orderDirection = 'asc'
    return request(app)
      .get(`/api/articles?topic=${topic}&sortBy=${sortBy}&orderDirection=${orderDirection}`) //${topic}`)
      .expect(200)
      .then(({ body }) => {
        const { articles } = body;
        expect(articles).toBeInstanceOf(Object);
        expect(articles).toBeSortedBy(sortBy, { descending: false });
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(String),
            })
          );
        });
      });
  });



});



describe("9. GET /api/articles/:article_id/comments", () => {
  test("status:200, responds with matching with article_id", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toBeInstanceOf(Object);
        comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              body: expect.any(String),
              comment_id: expect.any(Number),
              article_id: expect.any(Number),
              created_at: expect.any(String),
              votes: expect.any(Number),
            })
          );
        });
      });
  });
  //});

  test("status:404, article_id does not exist in table", () => {
    const article_id = 999;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `No comments found for this article_id: ${article_id}`
        );
      });
  });

  test("status:400, invalid article_id feed in", () => {
    const article_id = "banana";
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `invalid input syntax for type integer: "${article_id}"`
        );
      });
  });

  test("status:400, the article id exists, but there are no comments", () => {
    const article_id = 12;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `the article id exists, but there are no comments : ${article_id}`
        );
      });
  });
});

describe("10. POST /api/articles/:article_id/comments", () => {
  test("status:201, responds with matching with article_id", () => {
    const article_id = 1;
    const newComment = {
      username: "lurker",
      body: "SQL statement is a mash",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;
        expect(comment).toBeInstanceOf(Array);
        expect(comment[0].article_id).toEqual(article_id);
        expect(comment[0].author).toEqual(newComment.username);
        expect(comment[0].body).toEqual(newComment.body);
      });
  });

  test("status:404, Articles table not found for this article_id", () => {
    const article_id = 888;
    const newComment = {
      username: "lurker",
      body: "SQL statement is a mash",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `Articles table not found for this article_id : ${article_id}`
        );
      });
  });

  test("status:404, Users table not found for this username", () => {
    const article_id = 1;
    const newComment = {
      username: "xxlurkerxx",
      body: "SQL statement is a mash",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `Users table not found for this username : ${newComment.username}`
        );
      });
  });

  test("status:400, Missing input values from body", () => {
    const article_id = 1;
    const newComment = {
      username: "xxlurkerxx",
      //body: "SQL statement is a mash",
    };
    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe(
          `Missing value input (body/username)`
        );
      });
  });


});
