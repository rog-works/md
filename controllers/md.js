'use strict';

let Entity = require('../entities/md');
let Aggregation = require('../aggregations/md2tag');
let Projector = require('../components/projector');
let Render = require('../helpers/render');

let actionIndex = (app) => {
  app.get('/md.:ext(json|csv|html)', (req, res) => {
    console.log('index able!!' + req.params.ext);
    let ext = req.params.ext;
    let accept = {id:'id', title:'title'};
    let results = Projector.select(Entity.all(), accept);
    Render[ext](res, results);
  });
};

let actionShow = (app) => {
  app.get('/md/:id([\\d]+)', (req, res) => {
    let id = Number(req.params.id);
    console.log('show able!! [' + id + ']');
    let e = Entity.get(id);
    let tags = e === null ? null : Aggregation.findTagsByMDId(e.id);
    if (e !== null) {
      e.tags = tags;
      console.log(e);
      res.contentType('application/json');
      res.send(JSON.stringify(e));
    } else {
      res.sendStatus(404);
    }
  });
};

let actionCreate = (app) => {
  app.post('/md', (req, res) => {
    console.log('create able!! [' + req.body.md + ']');
    let e = Entity.create(req.body.md);
    res.contentType('application/json');
    res.send(JSON.stringify(e));
  });
};

module.exports = {
  actionIndex,
  actionShow,
  actionCreate
};