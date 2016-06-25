'use strict';

let Projector = {
  select: (value, keys) => {console.log(value);
    if (Array.isArray(value)) {
      return value.map((self) => {
          return Projector._select(self, keys);
        });
    } else if (typeof value === 'object') {
      return Projector._select(value, keys);
    } else {
      return value;
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