'use strict';

const Model = require('../models/model');

class Tag extends Model {
	constructor () {
		super('tag');
	}

	static keys () {
		return ['id', 'name'];
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

	// create from md
	create (md, callback) {
		this.on('insert', callback).insert({name: name});
	}

	// destroy by id
	destroy (id, callback) {
		this.on('delete', callback).delete(id);
	}
}

module.exports = Tag;