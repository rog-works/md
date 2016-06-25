'use strict';

let Promise = require('promise');
let Request = require('request');
let Cheerio = require('cheerio');
let router = require('express').Router();
let params = {
	baseUrl: 'http://ejje.weblio.jp/content/'
};

let getURL = (w) => {
	return params.baseUrl + w;
};

let send = (url) => {
	return new Promise((resolve, reject) => {
		Request(url, (error, res, body) => {
			if (!error && res.statusCode === 200) {
				resolve(body);
			} else {
				reject(res.statusCode, error);
			}
		});
	});
}

let parse = (body) => {
	let $ = Cheerio(body),
		meta = $.find('meta[name="description"]'),
		content = meta.attr('content');
	return content;
}

router.get('/', (req, res) => {
	send(getURL(req.query.word))
		.then((body) => {
			res.send(parse(body));
		})
		.catch((status, error) => {
			console.log('error! ' + status);
			console.log(error);
			res.send('Unknown word. ' + req.query.word);
		});
});

module.exports = router;