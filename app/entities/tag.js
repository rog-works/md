'use strict';

let keys = () => {
	return ['id', 'name'];
};

// get all
let all = () => {
	return tags;
};

let get = (id) => {
	return findByIds([id]).pop() || null;
};

let findByIds = (ids) => {
	return filter(ids, 'id');
};

// at once
let filter = (ids, key) => {
	return tags.filter((self) => {
		return ids.indexOf(self[key]) !== -1;
	});
};

// create from tag
let create = (tag) => {
	let e = {
		id: ++lastId,
		name: tag
	};
	tags.push(e);
	return e;
};

// destroy by id
let destroy = (id) => {
	let len = tags.length;
	tags = tags.filter((self) => {
		return self.id !== id;
	});
	return len - tags.length;
};

let lastId = 2;
let tags = [
	{id: 1, name: 'IT'},
	{id: 2, name: 'AWS'}
];

module.exports = {
	keys: keys,
	all: all,
	get: get,
	findByIds:findByIds,
	create: create,
	destroy: destroy
};