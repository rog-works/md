class App {
	constructor () {
		this.console = new Console();
		this.page = ko.observable('index');
		this.mds = ko.observableArray([]);
		this.maker = MD.empty();
		this.tags = ko.observableArray([]);
		this.tagMaker = Tag.empty();
		this.decorator = marked;
		// XXX
		this.decorator.setOptions({
			langPrefix: 'language-'
		});
	}

	static init (id = 'md-main') {
		let self = new App();
		ko.applyBindings(self, document.getElementById(id));
		self.load();
		return self;
	}

	load () {
		MD.index((entities) => {
			this.mds.removeAll();
			for (const entity of entities) {
				this.mds.push(new MD(entity));
			}
			console.log('Loaded mds.');
		});
		Tag.index((entities) => {
			this.tags.removeAll();
			for (const entity of entities) {
				this.tags.push(new Tag(entity));
			}
			console.log('Loaded tags.');
		});
	}

	search (tagId) {
		MD.search(tagId, (entities) => {
			this.mds.removeAll();
			for (const entity of entities) {
				this.mds.push(new MD(entity));
			}
			this.maker.copy(MD.empty());
		});
	}

	create () {
		const title = window.prompt('input create md title');
		if (title && title.length > 0) {
			MD.create(title, (entity) => {
				const md = new MD(entity);
				this.mds.push(md);
				this.maker.copy(md);
				console.log(`Created md. ${md.id}`);
			});
		}
	}

	update () {
		const md = this._getMD(this.maker.id);
		if (md && this.maker.body().length > 0) {
			md.copy(this.maker);
			md.update();
			console.log(`Updated md. ${md.id}`);
		}
	}
	
	destroy (md) {
		MD.destroy(md.id, (id) => {
			const target = this.mds.remove((self) => {
				return self.id === id;
			});
			console.log(`Deleted md. ${target}`);
		});
	}

	activate (page) {
		this.page(page);
	}

	tagged (self, e) {
		if (e.keyCode !== 13) {
			return true;
		}
		const md = this._getMD(this.maker.id);
		if (!md) {
			return true;
		}
		const tagName = this.tagMaker.name();
		const exists = md.tags().filter((self) => {
			return self.name() === tagName;
		});
		if (exists.length > 0) {
			console.log(`Already tagged. ${md.id} ${exists.pop().id}`);
			return true;
		}
		const tag = this._getTagByName(tagName);
		const callback = (tag) => {
			this.maker.copy(md);
			this.tagMaker.copy(Tag.empty());
			console.log(`Tagged. ${md.id} ${tag.id}`);
		};
		if (tag) {
			md.tagged(tag, callback);
		} else {
			Tag.create(tagName, (entity) => {
				const newTag = new Tag(entity);
				this.tags.push(newTag);
				md.tagged(newTag, callback);
			});
		}
		return false;
	}

	untagged (tag) {
		const md = this._getMD(this.maker.id);
		if (md) {
			md.untagged(tag, (tag) => {
				this.maker.copy(md);
				console.log(`Untagged. ${md.id} ${tag.id}`);
			});
		}
	}

	// XXX
	decorate (body) {
		let content = this.decorator(body);
		let blocks = $(content).find('code');
		for (let block of blocks) {
			// FIXME
			Prism.highlightElement(block);
		}
		return content;
	}

	_getMD (id) {
		return this.mds().filter((self) => {
			return self.id === id;
		}).pop();
	}

	_getTagByName (name) {
		return this.tags().filter((self) => {
			return self.name() === name;
		}).pop();
	}
}
