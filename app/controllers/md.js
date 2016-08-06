'use strict';

const Entity = require('../entities/md');
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

router.get('/search/:tagId([\\d]+).:ext(json|csv)', (req, res) => {
	console.log('search able!!', req.params.tagId, req.params.ext, req.query.filter);
	let tagId = Number(req.params.tagId);
	let filter = req.query.filter || Entity.keys().join('|');
	let accept = filter.split('|');
	Aggregation.findMDs(tagId, (rows) => {
		Render[req.params.ext](res, Projector.select(rows, accept));
	});
});

router.get('/:id([\\d]+).:ext(json|csv)', (req, res) => {
	console.log('show able!!', req.params.id, req.params.ext, req.query.filter);
	let id = Number(req.params.id);
	let filter = req.query.filter || Entity.keys().join('|');
	let accept = filter.split('|');
	Aggregation.get(id, (row) => {
		if (row === null) {
			Render.notFound(res);
		} else {
			Render[req.params.ext](res, Projector.select(row, accept));
		}
	});
});

router.post('/', (req, res) => {
	console.log(`create able!! ${req.body.body}`);
	Entity.create(req.body.body, (message) => {
		Render.json(res, message);
	});
});

router.delete('/:id([\\d]+)', (req, res) => {
	console.log('destroy able!!', req.params.id);
	let id = Number(req.params.id);
	Aggregation.invalidate(id, (message) => {
		Render.json(res, message);
	});
});

module.exports = router;