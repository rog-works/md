'use strict';

class Tag {
	constructor (entity) {
		this.id = Number(entity.id);
		this.name = ko.observable(entity.name);
	}

	static empty () {
		return new Tag({
			id: -1,
			name: ''
		});
	}

	static send (url, data, callback) {
	    const _url = `/tag${url}`;
		let _data = {
			url: _url,
			type: 'GET',
			dataType: 'json',
			success: (res) => {
				console.log('respond. ' + _url);
				callback(res);
			},
			error: (res, err) => {
				console.error(err, res.status, res.statusText, res.responseText);
			}
		};
		console.log('request. ' + _url);
		$.ajax($.extend(_data, data));
	}

	static index (callback) {
		Tag.send('/.json', {}, callback);
	}

	static create (name, callback) {
		Tag.send('/.json', {type: 'POST', data: {tag: name}}, callback);
	}

	search () {
		// XXX depands on App...
		LIB.app.search(this.id);
	}

	untagged () {
		// XXX depands on App...
		LIB.app.untagged(this);
	}

	copy (source) {
		this.id = source.id;
		this.name(source.name());
	}
}