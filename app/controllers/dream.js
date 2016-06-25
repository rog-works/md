'use strict'

let router = require('express').Router();

router.get('/', (request, response) => {
	response.send(dreams);
});

router.get('/d', (req, res) => {
	dreams.pop();
	res.send(dreams);
});

router.post('/', (request, response) => {
	dreams.push(request.query.dream);
	response.sendStatus(200);
});

let dreams = [
	'Find and count some sheep',
	'Climb a really tall mountain',
	'Wash the dishes'
];

module.exports = router;
