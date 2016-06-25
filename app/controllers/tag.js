'use strict'

let Entity = require('../entities/tag');
let Aggregation = require('../aggregations/md2tag');
let Projector = require('../components/projector');
let Render = require('../helpers/render');
let router = require('express').Router();

router.get('/.:ext(json|csv)', (req, res) => {
	console.log(`index able!! ${req.params.ext}`);
	Render[req.params.ext](res, Entity.all());
});

router.get('/:id([\\d]+).:ext(json|csv)', (req, res) => {
	console.log('show able!!', req.params.id, req.params.ext);
	let id = Number(req.params.id);
	let e = Entity.get(id);
	if (e === null) {
		Render.notFound(res);
	} else {
		let accept = {id:'id', title:'title'};
		e.mds = Projector.select(Aggregation.findMDsByTagId(id), accept);
		Render[req.params.ext](res, e);
	}
});

router.post('/', (req, res) => {
	console.log(`create able!! ${req.body.tag}`);
	Render.json(res, Entity.create(req.body.tag));
});

router.delete('/:id([\\d]+)', (req, res) => {
	console.log(`destroy able!! ${req.params.id}`);
	Render.json(res, Entity.destroy(Number(req.params.id)));
});

module.exports = router;
