class App {
	constructor () {
		this.console = new Console();
		this.page = ko.observable('index');
		this.mds = ko.observableArray([]);
		this.maker = MD.empty();
		this.tag = {
			input: ko.observable(''),
			items: ko.observableArray([])
		};
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
		});
		Tag.index((entities) => {
			this.tag.items.removeAll();
			for (const entity of entities) {
				this.tag.items.push(new Tag(entity));
			}
		});
	}

	search (tagId) {
		MD.search(tagId, (entities) => {
			this.mds.removeAll();
			for (const entity of entities) {
				this.mds.push(new MD(entity));
			}
		});
	}

	save () {
		if (this.maker.body().length === 0) {
			return;
		}
		if (this.maker.id === -1) {
			this._append();
		} else {
			this._update();
		}
	}

	_append () {
		MD.create(this.maker.body(), (entity) => {
			const md = new MD(entity);
			// this._appendTags(md, (res) => {
				this.mds.push(md);
				this.maker.deepCopy(MD.empty());
			// });
		});
	}

	_update () {
		const md = this.mds().filter((self) => {
			return self.id === this.maker.id;
		}).pop();
		if (md !== null) {
			MD.update(this.maker.id, this.maker.body(), (entity) => {
				// this._appendTags(md, (res) => {
				// 	this._removeTags(md, () => {
						md.deepCopyFromEntity(entity);
						this.maker.deepCopy(MD.empty());
				// 	});
				// });
			});
		}
	}

	_appendTags (md, callback) {
		for (const tag of md.tags()) {
			if (tag.id === -1) {
				Tag.create(tag.name, (entity) => {
					this.tag.items.push(new Tag(entity));
					md.tagged(md.id, entity.id, callback);
				});
			} else {
				md.tagged(md.id, tag.id, callback);
			}
		}
	}

	_removeTags (md, callback) {
		const tagIds = this.maker.tags().map((self) => {
			return self.id;
		});
		const removeTagIds = md.tags().filter((self) => {
			return tagIds.indexOf(self.id) === -1;
		});
		for (const tagId of removeTagIds) {
			md.untagged(tagId);
		}
	}

	activate (page) {
		this.page(page);
	}

	tagged (self, e) {
		if (e.keyCode !== 13) {
			return true;
		}
		const tagName = this.tag.input();
		const exists = this.tag.items().filter((self) => {
			return self.name === tagName;
		});
		if (exists.length === 0) {
			this.maker.tags.push(new Tag({name: tagName}));
		} else {
			this.maker.tags.push(exists.pop());
		}
		this.tag.input('');
		return false;
	}

	untagged (tag) {
		const target = this.maker.tags.remove((self) => {
			return (tag.id > 0) ? tag.id === self.id : tag.name === self.name;
		});
		console.log(`${target} untagged`);
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
}