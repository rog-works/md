'use strict';

const client = require('redis').createClient('redis://editor-db:6379');

class Model {
	constructor (table) {
		this.table = table;
		this.handlers = {
			'select': [this._onSelect],
			'insert': [this._onInsert],
			'update': [this._onUpdate],
			'delete': [this._onDelete],
			'count': [this._onCount],
			'error': [this._onError]
		};
	}

	factory (table) {
		return new Model(table);
	}

	on (tag, handler) {
		this.handlers[tag].unshift(handler);
		return this;
	}

	at (id) {
		client.hgetall(this._toKey(id), (err, row) => {
			this._listen('select', err, row);
		});
	}

	find (filter = null) {
		client.keys(this._toKey('*'), (err, keys) => {
			let rows = [];
			let get = (key) => {
				client.hgetall(key, (err, row) => {
					if (err) {
						this._listen('error', err);
						return;
					}
					if (filter === null || filter(row)) {
						rows.push = row;
					}
					// XXX
					if (keys.length > 0) {
						get(keys.shift());
					} else {
						this._listen('select', err, rows);
					}
				});
			};
			get(keys.shift());
		});
	}

	count () {
		client.keys(this._toKey('*'), (err, keys) => {
			this._listen('count', err, keys.length);
		});
	}

	insert (row) {
		client.incr(this._getIncIdKey(), (err, id) => {
			row.id = id;
			client.hmset(this._toKey(id), row, (err, message) => {
				this._listen('insert', err, message);
			});
		});
	}

	update (id, row) {
		let key = this._toKey(id);
		client.exists(key, (err, exists) => {
			if (exists) {
				client.hmset(key, row, (err, message) => {
					this._listen('update', err, message);
				});
			} else {
				this._listen('error', `Not found Key. ${key}`);
			}
		});
	}

	delete (id, row) {
		client.del(this._toKey(id), (err, message) => {
			this._listen('delete', err, message);
		});
	}

	_toKey (id) {
		return `${this.table}_${id}`;
	}

	_getIncIdKey () {
		return `incid_${this.table}`;
	}

	_onSelect (...args) {
		console.log('on select', args);
		return true;
	}

	_onInsert (...args) {
		console.log('on insert', args);
		return true;
	}

	_onUpdate (...args) {
		console.log('on update', args);
		return true;
	}

	_onDelete (...args) {
		console.log('on delete', args);
		return true;
	}

	_onCount (...args) {
		console.log('on count', args);
		return true;
	}

	_onError (...args) {
		console.log('on error', args);
		return true;
	}

	_listen (tag, err, ...args) {
		if ((tag !== 'error') && err) {
			this._listen('error', false, args);
		}
		for (let handler of this.handlers[tag]) {
			if (!handler.apply(this, args)) {
				break;
			}
		}
	}
}

module.exports = Model;