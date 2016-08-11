'use strict';

const Entity = require('../entities/md');
const Aggregation = require('../aggregations/mdservice');
const Controller = require('../components/controller');
const Router = require('../components/router');

class MDController extends Controller {
	constructor () {
		super();
	}

	index (ext, filter) {
		Entity.all((rows) => {
			this.view(rows, ext, filter);
		});
	}

	show (id, ext, filter) {
		Aggregation.get(Number(id), (row) => {
			this.view(row, ext, filter);
		});
	}

	create (body, ext, filter) {
		Entity.create(body, (entity) => {
			this.view(entity, ext, filter);
		});
	}

	update (id, body, ext, filter) {
		Entity.update(Number(id), body, (entity) => {
			this.view(entity, ext, filter);
		});
	}

	destroy (id, ext, filter) {
		Aggregation.invalidate(Number(id), (id) => {
			this.view(id, ext, filter);
		});
	}

	search (tagId, ext, filter) {
		Aggregation.findMDs(Number(tagId), (rows) => {
			this.view(rows, ext, filter);
		});
	}

	tagged (id, tagId, ext, filter) {
		Aggregation.tagged(Number(id), Number(tagId), (relation) => {
			this.view(relation, ext, filter);
		});
	}

	untagged (id, tagId, ext, filter) {
		Aggregation.untagged(Number(id), Number(tagId), (relations) => {
			this.view(relations, ext, filter);
		});
	}

	keys () {
		return Entity.keys();
	}

	routes () {
		return [
			Router.get('/.:ext(json|csv)')
				.params('ext')
				.query('filter')
				.on('index'),
			Router.get('/:id([\\d]+).:ext(json|csv)')
				.params('id')
				.params('ext')
				.query('filter')
				.on('show'),
			Router.post('/.:ext(json|csv)')
				.body('body')
				.params('ext')
				.query('filter')
				.on('create'),
			Router.put('/:id([\\d]+).:ext(json|csv)')
				.params('id')
				.body('body')
				.params('ext')
				.query('filter')
				.on('update'),
			Router.delete('/:id([\\d]+).:ext(json|csv)')
				.params('id')
				.params('ext')
				.query('filter')
				.on('destroy'),
			Router.get('/search/:tagId([\\d]+).:ext(json|csv)')
				.params('tagId')
				.params('ext')
				.query('filter')
				.on('search'),
			Router.put('/:id([\\d]+)/:tagId([\\d]+).:ext(json|csv)')
				.params('id')
				.params('tagId')
				.params('ext')
				.query('filter')
				.on('tagged'),
			Router.delete('/:id([\\d]+)/:tagId([\\d]+).:ext(json|csv)')
				.params('id')
				.params('tagId')
				.params('ext')
				.query('filter')
				.on('untagged')
		];
	}
}

module.exports = Router.bind(new MDController());
