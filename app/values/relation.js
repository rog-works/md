'use strict';

const Model = require('../models/model');

class Relation extends Model {
	constructor () {
		super('relation');
	}

	static keys () {
		return [ 'mdId', 'tagId'];
	}

	get (id, callback) {
		this.on('select', callback).at(id);
	}

	// get all
	all (callback) {
		this.on('select', callback).find();
	}

	findByIds (ids, callback) {
		this.on('select', callback).find((self) => { return ids.indexOf(self.id); });
	}

	findByMDId (mdId) {
		this.on('select', callback).find((self) => { return mdId == self.mdId; });
	}

	findByTagId (tagId) {
		this.on('select', callback).find((self) => { return tagId == self.tagId; });
	}

	// create from mdId and tagId
	create (mdId, tagId, callback) {
		this.on('insert', callback).insert({mdId: mdId, tagId: tagId});
	}

	// destroy by id
	destroy (id, callback) {
		this.on('delete', callback).delete(id);
	}
}

module.exports = Relation;