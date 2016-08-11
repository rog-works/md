'use strict';

const Entity = require('../entities/md');
const Aggregation = require('../aggregations/mdservice');
const Projector = require('../components/projector');
const Render = require('../helpers/render');
const router = require('express').Router();

router.get('/.:ext(json|csv)', (req, res) => {
	console.log('index able!!', req.params.ext, req.query.filter);
	const filter = req.query.filter || Entity.keys().join('|');
	const accept = filter.split('|');
	Entity.all((rows) => {
		Render[req.params.ext](res, Projector.select(rows, accept));
	});
});

router.get('/search/:tagId([\\d]+).:ext(json|csv)', (req, res) => {
	console.log('search able!!', req.params.tagId, req.params.ext, req.query.filter);
	const tagId = Number(req.params.tagId);
	const filter = req.query.filter || Entity.keys().join('|');
	const accept = filter.split('|');
	Aggregation.findMDs(tagId, (rows) => {
		Render[req.params.ext](res, Projector.select(rows, accept));
	});
});

router.get('/:id([\\d]+).:ext(json|csv)', (req, res) => {
	console.log('show able!!', req.params.id, req.params.ext, req.query.filter);
	const id = Number(req.params.id);
	const filter = req.query.filter || Entity.keys().join('|');
	const accept = filter.split('|');
	Aggregation.get(id, (row) => {
		if (row === null) {
			Render.notFound(res);
		} else {
			Render[req.params.ext](res, Projector.select(row, accept));
		}
	});
});

router.post('/', (req, res) => {
	console.log('create able!!', req.body.body);
	Entity.create(req.body.body, (entity) => {
		Render.json(res, entity);
	});
});

router.put('/:id([\\d]+)/:tagId([\\d]+)', (req, res) => {
	console.log('tagged able!!', req.params.id, req.params.tagId);
	const id = Number(req.params.id);
	const tagId = Number(req.params.tagId);
	Aggregation.tagged(id, tagId, (relation) => {
		if (relation === null) {
			Render.conflict(res);
		} else {
			Render.json(res, relation);
		}
	});
});

router.put('/:id([\\d]+)', (req, res) => {
	console.log('update able!!', req.params.id, req.body.body);
	const id = Number(req.params.id);
	Entity.update(id, req.body.body, (entity) => {
		Render.json(res, entity);
	});
});

router.delete('/:id([\\d]+)/:tagId([\\d]+)', (req, res) => {
	console.log('untagged able!!', req.params.id, req.params.tagId);
	const id = Number(req.params.id);
	const tagId = Number(req.params.tagId);
	Aggregation.untagged(id, tagId, (relations) => {
		Render.json(res, relations);
	});
});

router.delete('/:id([\\d]+)', (req, res) => {
	console.log('destroy able!!', req.params.id);
	const id = Number(req.params.id);
	Aggregation.invalidate(id, (id) => {
		Render.json(res, id);
	});
});

module.exports = router;