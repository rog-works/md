'use strict';

const Model = require('../models/model');
const TABLE_NAME = 'md';

class MD {
	static keys () {
		return ['id', 'title', 'body'];
	};

	static get (id, callback) {
		Model.factory(TABLE_NAME).on('select', callback).at(id);
	}

	// get all
	static all (callback) {
		Model.factory(TABLE_NAME).on('select', callback).find();
	}

	static findByIds (ids, callback) {
		Model.factory(TABLE_NAME).on('select', callback).find((self) => { return ids.indexOf(Number(self.id)) !== -1; });
	}

	// create from md
	static create (body, callback) {
		Model.factory(TABLE_NAME).on('insert', callback).insert({ title: MD._toTitle(body), body: body });
	}

	// update by id and body
	static update (id, body, callback) {
		Model.factory(TABLE_NAME).on('update', callback).update(id, { id: id, title: MD._toTitle(body), body: body });
	}

	// destroy by id
	static destroy (id, callback) {
		Model.factory(TABLE_NAME).on('delete', callback).delete(id);
	}

	// body to tite
	static _toTitle (body) {
		const pos = body.indexOf('\n');
		const title = pos === -1 ? body : body.substr(0, pos);
		return title;
	}
}

module.exports = MD;
