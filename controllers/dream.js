'use strict'

let dream = {};

dream.index = (app) => {
  app.get("/", (request, response) => {
    response.sendFile('/app/src/views/index.html');
  });
};

dream.show = (app) => {
  app.get("/dreams", (request, response) => {
    response.send(dreams);
  });
};

dream.destroy = (app) => {
  app.get("/dreams/d", (req, res) => {
    dreams.pop();
    res.send(dreams);
  });
};

// could also use the POST body instead of query string: http://expressjs.com/en/api.html#req.body
dream.create = (app) => {
  app.post("/dreams", (request, response) => {
    dreams.push(request.query.dream);
    response.sendStatus(200);
  });
};

// Simple in-memory store for now
let dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
  ];

module.exports = dream;
