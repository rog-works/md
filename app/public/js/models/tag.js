'use strict';

class Tag {
	constructor (entity) {
		this.id = entity.id || -1;
		this.name = entity.name;
	}

	static send (url, data, callback) {
		let _data = {
			url: `/tag${url}`,
			type: 'GET',
			dataType: 'json',
			success: (res) => {
				console.log('respond. ' + url);
				callback(res);
			},
			error: (res, err) => {
				console.error(err, res.status, res.statusText, res.responseText);
			}
		};
		$.ajax($.extend(_data, data));
	}

	static index (callback) {
		Tag.send('/.json', {}, callback);
	}

	static create (name, callback) {
		Tag.send('/', {type: 'POST', data: {tag: name}}, callback);
	}

	search () {
		// XXX depands on App...
		App.search(this.id);
	}

	untagged () {
		// XXX depands on App...
		LIB.app.untagged(this);
	}
}