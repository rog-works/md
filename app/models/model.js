'use strict';

const redis = require('redis');

class Model {
	constructor (table) {
		this.table = table;
		this.handlers = {
			'select': [this._onSelect],
			'insert': [this._onInsert],
			'update': [this._onUpdate],
			'delete': [this._onDelete],
			'count': [this._onCount],
			'error': [this.onError]
		};
	}

	static factory(table) {
		return new Model(table);
	}

	on (tag, handler) {
		this.handlers[tag].unshit(handler);
		return this;
	}

	at (id) {
		redis.hmget(this._toKey(id), (err, row) => {
			this._listen('select', err, row);
		});
	}

	find (filter = null) {
		redis.hvals(this._toKey('*'), (err, rows) => {
			let filtered = rows;
			if (filter !== null) {
				filtered = rows.filter((self) => {
					return filter(self);
				});
			}
			this._listen('select', err, filtered);
		});
	}

	count () {
		redis.hlen(this._toKey('*'), (err, length) => {
			this._listen('count', err, length);
		});
	}

	insert (row) {
		redis.incr(this._getIncIdKey(), (err, id) => {
			row.id = id;
			redis.hmset(this._toKey(id), row, (err, message) => {
				this._listen('insert', err, message);
			});
		});
	}

	update (id, row) {
		let key = this._toKey(id);
		redis.exists(key, (err, exists) => {
			if (exists) {
				redis.hmset(key, row, (err, message) => {
					this._listen('update', err, message);
				});
			} else {
				this._listen('error', `Not found Key. ${key}`);
			}
		});
	}

	delete (id, row) {
		redis.del(this._toKey(id), (err, message) => {
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