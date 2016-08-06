'use strict'

let router = require('express').Router();

router.get('/', (request, response) => {
	response.sendFile('/opt/app/views/index2.html');
});

module.exports = router;
