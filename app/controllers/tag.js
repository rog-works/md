'use strict'

const Entity = require('../entities/tag');
const Aggregation = require('../aggregations/mdservice');
const Router = require('../components/router');

class TagRouter extends Router {
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

	_keys () {
		return Entity.keys();
	}

	_routes () {
		return [
			{
				method: 'get',
				path: '/.:ext(json|csv)',
				on: 'index',
				args: ['params.ext', 'query.filter']
			},
			{
				method: 'get',
				path: '/:id([\\d]+).:ext(json|csv)',
				on: 'show',
				args: ['params.id', 'params.ext', 'query.filter']
			},
			{
				method: 'post',
				path: '/.:ext(json|csv)',
				on: 'create',
				args: ['body.tag', 'params.ext', 'query.filter']
			},
			{
				method: 'delete',
				path: '/:id([\\d]+).:ext(json|csv)',
				on: 'destroy',
				args: ['params.id', 'params.ext', 'query.filter']
			}
		]
	}
}

module.exports = (new TagRouter()).bind();
