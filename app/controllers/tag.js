'use strict'

let Entity = require('../entities/tag');
let Aggregation = require('../aggregations/md2tag');
let Projector = require('../components/projector');
let Render = require('../helpers/render');
let router = require('express').Router();

router.get('/.:ext(json|csv)', (req, res) => {
	console.log('index able!!', req.params.ext, req.query.filter);
	let filter = req.query.filter || Entity.keys().join('|');
	let accept = filter.split('|');
	Render[req.params.ext](res, Projector.select(Entity.all(), accept));
});

router.get('/:id([\\d]+).:ext(json|csv)', (req, res) => {
	console.log('show able!!', req.params.id, req.params.ext, req.query.filter);
	let id = Number(req.params.id);
	let filter = req.query.filter || Entity.keys().join('|');
	let accept = filter.split('|');
	let e = Entity.get(id);
	if (e === null) {
		Render.notFound(res);
	} else {
		e.mds = Aggregation.findMDsByTagId(id);
		Render[req.params.ext](res, Projector.select(e, accept));
	}
});

router.post('/', (req, res) => {
	console.log('create able!!', req.body.tag);
	Render.json(res, Entity.create(req.body.tag));
});

router.delete('/:id([\\d]+)', (req, res) => {
	console.log('destroy able!!', req.params.id);
	Render.json(res, Entity.destroy(Number(req.params.id)));
});

module.exports = router;
