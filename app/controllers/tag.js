'use strict'

const Entity = require('../entities/tag');
const Aggregation = require('../aggregations/mdservice');
const Controller = require('../components/controller');
const Router = require('../components/router');

class TagController extends Controller {
	constructor () {
		super();
	}
	
	index (ext, filter) {
		Entity.all((rows) => {
			this.view(rows, ext, filter);
		});
	}

	show (id, ext, filter) {
		Aggregation.getTag(Number(id), (row) => {
			this.view(row, ext, filter);
		});
	}

	create (name, ext, filter) {
		Entity.containts(name, (exists) => {
			if (exists.length === 0) {
				Entity.create(name, (entity) => {
					this.view(entity, ext, filter);
				});
			} else {
				console.log(`Already tag exists. ${name}`);
				// Render.conflict(res);
				this.view(exists.pop(), ext, filter);
			}
		});
	}

	destroy (id, ext, filter) {
		Aggregation.untaggedAll(id, (id) => {
			this.view(id, ext, filter);
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
			Router.get('/.:ext(json|csv)')
				.params('id')
				.params('ext')
				.query('filter')
				.on('show'),
			Router.post('/.:ext(json|csv)')
				.body('tag')
				.params('ext')
				.query('filter')
				.on('create'),
			Router.delete('/.:ext(json|csv)')
				.params('id')
				.params('ext')
				.query('filter')
				.on('destroy')
		]
	}
}

module.exports = Router.bind(new TagController());
