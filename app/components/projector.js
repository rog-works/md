'use strict';

let Projector = {
	select: (body, keys) => {console.log(body);
		if (Array.isArray(body)) {
			return body.map((self) => {
					return Projector._select(self, keys);
				});
		} else if (typeof body === 'object') {
			return Projector._select(body, keys);
		} else {
			return body;
		}
	},
	_select: (obj, keys) => {
		if (Array.isArray(keys)) {
			return Projector.values(obj, keys);
		} else if (typeof keys === 'object') {
			return Projector.as(obj, keys);
		} else {
			return (keys in obj) ? obj[keys] : null;
		}
	},
	as: (obj, alias) => {
		let ret = {};
		for (let key in alias) {
			if (key in obj) {
				ret[alias[key]] = obj[key];
			}
		}
		return ret;
	},
	values: (obj, keys) => {
		let ret = [];
		for (let key of keys) {
			if (key in obj) {
				ret.push(obj[key]);
			}
		}
		return ret;
	}
};

module.exports = Projector;