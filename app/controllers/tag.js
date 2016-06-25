'use strict'

let Entity = require('../entities/tag');
let Render = require('../helpers/render');
let router = require('express').Router();

router.get('/.:ext(json|csv|html)', (req, res) => {
	console.log(`index able!! ${req.params.ext}`);
	Render[req.params.ext](res, Entity.all());
});

router.get('/:id([\\d]+)', (req, res) => {
	console.log(`show able!! ${req.params.id}`);
	Render.json(res, Entity.get(req.params.id));
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
