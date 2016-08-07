'use strict';

const Model = require('../models/model');
const TABLE_NAME = 'tag';

class Tag {
	static keys () {
		return ['id', 'name'];
	}

	static get (id, callback) {
		return Model.factory(TABLE_NAME).on('select', callback).at(id);
	}

	// get all
	static all (callback) {
		return Model.factory(TABLE_NAME).on('select', callback).find();
	}

	static findByIds (ids, callback) {
		return Model.factory(TABLE_NAME).on('select', callback).find((self) => { return ids.indexOf(Number(self.id)) !== -1; });
	}

	// create from name
	static create (name, callback) {
		return Model.factory(TABLE_NAME).on('insert', callback).insert({ name: name });
	}

	// destroy by id
	static destroy (id, callback) {
		return Model.factory(TABLE_NAME).on('delete', callback).delete(id);
	}
}

module.exports = Tag;