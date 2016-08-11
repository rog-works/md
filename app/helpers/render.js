'use strict';

let CSV = require('./csv');

let Render = {
	_sendProxy: (res, body) => {
		console.log(body);
		if (body !== null) {
			res.send(body);
		} else {
			res.sendStatus(404);
		}
	},
	notFound: (res, body = null) => {
		res.sendStatus(404);
	},
	conflict: (res, body = null) => {
		res.sendStatus(409);
	},
	json: (res, body) => {
		res.contentType('application/json');
		Render._sendProxy(res, JSON.stringify(body));
	},
	csv: (res, body) => {
		res.contentType('text/csv');
		Render._sendProxy(res, CSV.stringify(body));
	}
};

module.exports = Render;