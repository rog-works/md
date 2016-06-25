'use strict'

let Entity = require('../entities/tag');

let actionIndex = (app) => {
  app.get('/tag', (req, res) => {
    res.contentType('application/json');
    res.send(JSON.stringify(Entity.all()));
  });
};

let actionShow = (app) => {
  app.get('/tag/:id([\d]+)', (req, res) => {
    let e = Entity.get(req.params.id);
    if (e !== null) {
      res.contentType('application/json');
      res.send(JSON.stringify(e));
    } else {
      res.sendStatus(404);
    }
  });
};

let actionCreate = (app) => {
  app.post('/tag', (req, res) => {
    let e = Entity.create(req.body.tag);
    res.contentType('application/json');
    res.send(JSON.stringify(e));
  });
};

let actionDestroy = (app) => {
  app.delete('/tag/:id([\d]+)', (req, res) => {
    Entity.destroy(Number(req.params.id));
    res.sendStatus(200);
  });
};

module.exports = {
  actionIndex,
  actionShow,
  actionCreate,
  actionDestroy
};
