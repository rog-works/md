'use strict';

let CSV = {
	stringify: (body) => {
		if (Array.isArray(body)) {
			return body.map((self) => {
				return CSV.stringify(self);
			}).join('\n');
		} else if (typeof body === 'object') {
			let values = [];
			for (let key in body) {
				values.push(CSV.stringify(body[key]));
			}
			return values.join(',');
		} else {
			return body;
		}
	}
};

module.exports = CSV;