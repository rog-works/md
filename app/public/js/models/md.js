class MD {
	constructor (entity) {
		this.id = Number(entity.id);
		this.title = ko.observable(entity.title);
		this.body = ko.observable(entity.body || '');
		this.tags = ko.observableArray(entity.tags || '');
		this.content = ko.observable('');
		this.closed = ko.observable(true);
	}

	static send (url, data, callback) {
		const _url = `/md${url}`;
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

	static destroy (id, callback) {
		MD.send(`/${id}`, {type: 'DELETE'}, callback);
	}

	static empty () {
		return new MD({
			id: -1,
			title: ''
		});
	}

	update () {
		MD.send(`/${this.id}`, {type: 'PUT', data: {body: this.body()}}, (entity) => {
			this.copyFromEntity(entity);
		});
	}

	show () {
		if (this.body().length === 0) {
			this.load();
		}
		this.toggle();
	}

	load () {
		this.body('<img src="' + LIB.params.waitImgUrl + '" />');
		MD.send(`/${this.id}.json`, {}, (entity) => {
			this.copyFromEntity(entity);
		});
	}

	delete () {
		// XXX
		LIB.app.destroy(this);
	}

	tagged (tag, callback) {
		MD.send(`/${this.id}/${tag.id}`, {type: 'PUT'}, (relation) => {
			this.tags.push(tag);
			callback(tag);
		});
	}

	untagged (tag, callback) {
		MD.send(`/${this.id}/${tag.id}`, {type: 'DELETE'}, (relations) => {
			const removeIds = relations.map((self) => {
				return Number(self.tagId);
			});
			const target = this.tags.remove((self) => {
				return removeIds.indexOf(self.id) !== -1;
			}).pop();
			callback(target);
		});
	}

	edit () {
		if (this.body().length > 0) {
			// XXX depends on App...
			LIB.app.maker.copy(this);
		}
	}

	toggle () {
		this.closed(!this.closed());
	}

	copyFromEntity (source) {
		this.id = Number(source.id);
		this.title(source.title);
		this.body(source.body);
		// XXX
		this.content(LIB.app.decorate(source.body));
		this.tags.removeAll();
		for (const tag of source.tags) {
			this.tags.push(new Tag(tag));
		}
	}

	copy (source) {
		this.id = source.id;
		this.title(source.title());
		this.body(source.body());
		this.content(source.content());
		this.tags.removeAll();
		for (const tag of source.tags()) {
			this.tags.push(tag);
		}
	}
}
