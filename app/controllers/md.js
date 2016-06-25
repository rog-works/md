'use strict';

let Entity = require('../entities/md');
let Aggregation = require('../aggregations/md2tag');
let Projector = require('../components/projector');
let Render = require('../helpers/render');
let router = require('express').Router();

router.get('/.:ext(json|csv|html)', (req, res) => {
	console.log(`index able!! ${req.params.ext}`);
	let accept = {id:'id', title:'title'};
	let results = Projector.select(Entity.all(), accept);
	Render[req.params.ext](res, results);
});

router.get('/:id([\\d]+)', (req, res) => {
	console.log(`show able!! [${req.params.id}]`);
	let id = Number(req.params.id);
	let e = Entity.get(id);
	if (e === null) {
		Render.notFound(res);
	} else {
		e.tags = Aggregation.findTagsByMDId(e.id);
		Render.json(res, e);
	}
});

router.post('/', (req, res) => {
	console.log(`create able!! ${req.body.md}`);
	Render.json(Entity.create(req.body.md));
});

module.exports = router;