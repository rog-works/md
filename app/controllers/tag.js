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
	Entity.all((tags) => {
		const name = req.body.tag;
		const exists = tags.filter((self) => {
			return self.name === name;
		});
		if (exists.length === 0) {
			Entity.create(name, (entity) => {
				Render.json(res, entity);
			});
		} else {
			console.log('Already tag exists. ' + name);
			// Render.conflict(res);
			Render.json(res, exists.pop());;
		}
	});
});

router.delete('/:id([\\d]+)', (req, res) => {
	console.log('delete able!!', req.params.id);
	Aggregation.untaggedAll(id, (id) => {
		Render.json(res, id);
	});
});

module.exports = router;
