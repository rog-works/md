'use strict';

const Entity = require('../entities/md');
const Aggregation = require('../aggregations/mdservice');
const Router = require('../components/router');

class MDRouter extends Router {
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

	_keys () {
		return Entity.keys();
	}

	_routes () {
		return [
			{
				method: 'get',
				on: 'index',
				path: '/.:ext(json|csv)',
				args: ['params.ext', 'query.filter']
			},
			{
				method: 'get',
				on: 'show',
				path: '/:id([\\d]+).:ext(json|csv)',
				args: ['params.id', 'params.ext', 'query.filter']
			},
			{
				method: 'post',
				on: 'create',
				path: '/.:ext(json|csv)',
				args: ['body.body', 'params.ext', 'query.filter']
			},
			{
				method: 'put',
				on: 'update',
				path: '/:id([\\d]+).:ext(json|csv)',
				args: ['params.id', 'body.body', 'params.ext', 'query.filter']
			},
			{
				method: 'delete',
				on: 'destroy',
				path: '/:id([\\d]+).:ext(json|csv)',
				args: ['params.id', 'params.ext', 'query.filter']
			},
			{
				method: 'get',
				on: 'search',
				path: '/search/:tagId([\\d]+).:ext(json|csv)',
				args: ['params.tagId', 'params.ext', 'query.filter']
			},
			{
				method: 'put',
				on: 'tagged',
				path: '/:id([\\d]+)/:tagId([\\d]+).:ext(json|csv)',
				args: ['params.id', 'params.tagId', 'params.ext', 'query.filter']
			},
			{
				method: 'delete',
				on: 'untagged',
				path: '/:id([\\d]+)/:tagId([\\d]+).:ext(json|csv)',
				args: ['params.id', 'params.tagId', 'params.ext', 'query.filter']
			}
		];
	}
}

module.exports = (new MDRouter()).bind();
