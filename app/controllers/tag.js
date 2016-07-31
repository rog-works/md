'use strict'

const Entity = require('../entities/tag');
const Aggregation = require('../aggregations/md2tag');
const Projector = require('../components/projector');
const Render = require('../helpers/render');
const router = require('express').Router();

router.get('/.:ext(json|csv)', (req, res) => {
	console.log('index able!!', req.params.ext, req.query.filter);
	let filter = req.query.filter || Entity.keys().join('|');
	let accept = filter.split('|');
	(new Entity()).all((rows) => {
		let entities = Projector.select(rows, accept);
		Render[req.params.ext](res, entities);
	});
});

router.get('/:id([\\d]+).:ext(json|csv)', (req, res) => {
	console.log('show able!!', req.params.id, req.params.ext, req.query.filter);
	let id = Number(req.params.id);
	let filter = req.query.filter || Entity.keys().join('|');
	let accept = filter.split('|');
	(new Entity()).get(id, (row) => {
		if (row === null) {
			Render.notFound(res);
		} else {
			(new Aggregation()).findMDsByTagId(id, (mds) => {
				row.mds = mds;
				Render[req.params.ext](res, Projector.select(row, accept));
			});
		}
	});
});

router.post('/', (req, res) => {
	console.log('create able!!', req.body.tag);
	(new Entity()).create(req.body.tag, (message) => {
		Render.json(res, message);
	});
});

router.delete('/:id([\\d]+)', (req, res) => {
	console.log('destroy able!!', req.params.id);
	(new Entity()).destroy(req.params.id, (message) => {
		Render.json(res, message);
	});
});

module.exports = router;
