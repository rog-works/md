'use strict'

let Express = require('express');
let BodyParser = require('body-parser');
let app = Express();

app.use(Express.static('/opt/app/public'));
app.use(BodyParser.urlencoded({ extended: false }));

app.use('/', require('./controllers/index'));
app.use('/ww', require('./controllers/ww'));
app.use('/md', require('./controllers/md'));
app.use('/tag', require('./controllers/tag'));

module.exports = app;
