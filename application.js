'use strict'

let Express = require('express');
let BodyParser = require('body-parser');
let app = Express();

app.use(Express.static('public'));
app.use(BodyParser.urlencoded({ extended: false }));

let controllers = [
    require('./controllers/dream'),
    require('./controllers/2word'),
    require('./controllers/md'),
    require('./controllers/tag')
  ];

for(let i in controllers) {
  let controller = controllers[i];
  for(let j in controller) {
    controller[j](app);
  }
}

module.exports = app;
