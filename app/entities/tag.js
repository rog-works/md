'use strict';

const Model = require('../models/model');
const TABLE_NAME = 'tag';

class Tag {
	static keys () {
		return ['id', 'name'];
	}

	static get (id, callback) {
		Model.factory(TABLE_NAME).on('select', callback).at(id);
	}

	// get all
	static all (callback) {
		Model.factory(TABLE_NAME).on('select', callback).find();
	}

	static findByIds (ids, callback) {
		Model.factory(TABLE_NAME).on('select', callback).find((self) => { return ids.indexOf(self.id); });
	}

	// create from md
	static create (md, callback) {
		Model.factory(TABLE_NAME).on('insert', callback).insert({ name: name });
	}

	// destroy by id
	static destroy (id, callback) {
		Model.factory(TABLE_NAME).on('delete', callback).delete(id);
	}
}

module.exports = Tag;