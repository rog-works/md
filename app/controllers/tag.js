'use strict'

const Entity = require('../entities/tag');
const Aggregation = require('../aggregations/mdservice');
const Projector = require('../components/projector');
const Render = require('../helpers/render');
const router = require('express').Router();

router.get('/.:ext(json|csv)', (req, res) => {
	console.log('index able!!', req.params.ext, req.query.filter);
	let filter = req.query.filter || Entity.keys().join('|');
	let accept = filter.split('|');
	Entity.all((rows) => {
		Render[req.params.ext](res, Projector.select(rows, accept));
	});
});

router.get('/:id([\\d]+).:ext(json|csv)', (req, res) => {
	console.log('show able!!', req.params.id, req.params.ext, req.query.filter);
	let id = Number(req.params.id);
	let filter = req.query.filter || Entity.keys().join('|');
	let accept = filter.split('|');
	Aggregation.getTag(id, (row) => {
		if (row === null) {
			Render.notFound(res);
		} else {
			Render[req.params.ext](res, Projector.select(row, accept));
		}
	});
});

router.post('/', (req, res) => {
	console.log('create able!!', req.body.tag);
	Entity.create(req.body.tag, (message) => {
		Render.json(res, message);
	});
});

router.put('/:id([\\d]+)/:mdId([\\d])', (req, res) => {
	console.log('update able!!', req.params.id, req.params.mdId);
	let id = Number(req.params.id);
	let mdId = Number(req.params.mdId);
	Aggregation.tagged(id, mdId, (message) => {
		Render.json(res, message);
	});
});

router.delete('/:id([\\d]+)', (req, res) => {
	console.log('destroy able!!', req.params.id);
	let id = Number(req.params.id);
	Aggregation.untagged(id, (message) => {
		Render.json(res, message);
	});
});

module.exports = router;
