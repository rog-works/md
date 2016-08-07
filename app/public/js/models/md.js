class MD {
	constructor (md) {
		this.id = md.id;
		this.title = ko.observable(md.title);
		this.body = ko.observable(md.body || '');
		this.content = ko.observable('');
		this.tags = ko.observableArray(md.tags || '');
		this.closed = ko.observable(true);
	}

	static send (url, data, callback) {
		let _data = {
			url: `/md${url}`,
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
		console.log('request. ' + url);
		$.ajax($.extend(_data, data));
	}

	static index (callback) {
		let filter = ['id', 'title'].join('|');
		MD.send(`/.json?filter=${filter}`, {type: 'GET'}, callback);
	}

	static search (tagId, callback) {
		let filter = ['id', 'title'].join('|');
		MD.send(`/search/${tagId}.json?filter=${filter}`, {type: 'GET'}, callback);
	}

	static create (body, callback) {
		MD.send('/', {type: 'POST', data: {body: body}}, callback);
	}

	static update (id, body, callback) {
		MD.send(`/${this.id}`, {type: 'PUT', data: {body: body}}, cacllback);
	}

	static empty () {
		return new MD({
			id: -1,
			title: ''
		});
	}

	show (id) {
		if (this.body().length === 0) {
			this.load();
		}
		this.toggle();
	}

	load () {
		this.body('<img src="' + LIB.params.waitImgUrl + '" />');
		MD.send(`/${this.id}.json`, {}, (md) => {
			this.deepCopyFromEntity(md);
		});
	}

	delete () {
		MD.send(`/${this.id}`, {type: 'DELETE'}, () => {
			// XXX depends on App...
			const target = LIB.app.mds.remove((self) => {
				return self.id === this.id;
			});
			console.log(`${target} deleted`);
		});
	}

	edit () {
		if (this.body().length > 0) {
			// XXX depends on App...
			LIB.app.maker.deepCopy(this);
		}
	}

	toggle () {
		this.closed(!this.closed());
	}

	deepCopyFromEntity (source) {
		this.id = source.id;
		this.title(source.title);
		this.body(source.body);
		this.content(LIB.app.decorate(source.body));
		this.tags.removeAll();
		// FIXME tags undefined???
		for (const tag of (source.tags || [])) {
			this.tags.push(new Tag(tag));
		}
	}

	deepCopy (source) {
		this.id = source.id;
		this.title(source.title());
		this.body(source.body());
		this.content(source.content());
		this.tags.removeAll();
		for (const tag of source.tags()) {
			this.tags.push(new Tag(tag));
		}
	}
}

class Tag {
	constructor (entity) {
		this.id = entity.id;
		this.name = entity.name;
	}

	search () {
		// XXX depands on App...
		App.search(this.id);
	}
}
