'use strict';

const Model = require('../models/model');
const TABLE_NAME = 'relation';

class Relation {
	static keys () {
		return [ 'id', 'mdId', 'tagId'];
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

	static findByMDId (mdId) {
		Model.factory(TABLE_NAME).on('select', callback).find((self) => { return mdId == self.mdId; });
	}

	static findByTagId (tagId) {
		Model.factory(TABLE_NAME).on('select', callback).find((self) => { return tagId == self.tagId; });
	}

	// create from mdId and tagId
	static create (mdId, tagId, callback) {
		Model.factory(TABLE_NAME).on('insert', callback).insert({ mdId: mdId, tagId: tagId });
	}

	// destroy by id
	static destroy (id, callback) {
		Model.factory(TABLE_NAME).on('delete', callback).delete(id);
	}
}

module.exports = Relation;