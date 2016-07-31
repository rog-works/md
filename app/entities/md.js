'use strict';

const Model = require('../models/model');

class MD extends Model {
	constructor () {
		super('md');
	}

	static keys () {
		return ['id', 'title', 'md'];
	};

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
		let pos = md.indexOf('\n');
		let title = pos === -1 ? md : md.substr(0, pos);
		this.on('insert', callback).insert({title: title, md: md});
	}

	// destroy by id
	destroy (id, callback) {
		this.on('delete', callback).delete(id);
	}
}

module.exports = MD;
