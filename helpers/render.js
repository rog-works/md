'use strict';

let CSV = {
  stringify: (body) => {
    if (Array.isArray(body)) {
      return body.map((self) => {
        return CSV.strigify(self);
      }).join("\n");
    } else if (typeof body === 'object') {
      let values = [];
      for (let value of body) {
        values.push(CSV.stringify(value));
      }
      return values.join(',');
    } else {
      return body;
    }
  }
};

let Render = {
  json: (res, body) => {
    console.log(ret)
    res.contentType('application/json');
    res.send(JSON.stringify(body));
  },
  csv: (res, body) => {
    res.contentType('plain/text');
    res.send(CSV.stringify(body));
  }
};

module.exports = Render;