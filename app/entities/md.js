'use strict';

let keys = () => {
	return ['id', 'title', 'md'];
};

// get all
let all = () => {
	return posts;
};

let get = (id) => {
	return findByIds([id]).pop() || null;
};

let findByIds = (ids) => {
	return filter(ids, 'id');
};

// filter
let filter = (ids, key) => {
	return posts.filter((self) => {
		return ids.indexOf(self[key]) !== -1;
	});
};

// create from md
let create = (md) => {
	let pos = md.indexOf('\n');
	let title = pos === -1 ? md : md.substr(0, pos);
	let e = {id: ++lastId, title: title, md: md};
	posts.push(e);
	return e;
};

// destroy by id
let destroy = (id) => {
	let len = posts.length;
	posts = posts.filter((self) => {
		return self.id !== id;
	});
	return len - posts.length;
};

let lastId = 2;
let posts = [
	{id: 1, title: 'dummy', md: 'dummy'},
	{id: 2, title: 'title', md:
'title \n\
--- \n\
\n\
# "-" list \n\
- list \n\
	- list-in \n\
\n\
# "*" list \n\
* list2 \n\
	* list2-in \n\
\n\
# incremental list \n\
1. ほげ \n\
	1. 1-1 \n\
1. ぴよ \n\
	1. 2-1 \n\
\n\
# code block \n\
		$ curl http://localhost \n\
```bash \n\
$ co /path/to \n\
$ echo hoge | grep "hoge" > /dev/null \n\
``` \n\
\n\
# table \n\
|id	 |name |desc\n\
|---- |---- |----\n\
|1		|hoge |fuga\n\
\n\
# link \n\
[link](http://localhost) \n\
'
}
	];

module.exports = {
	keys: keys,
	all: all,
	get: get,
	findByIds: findByIds,
	create: create,
	destroy: destroy
};