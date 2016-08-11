class App {
	constructor () {
		this.console = new Console();
		this.page = ko.observable('index');
		this.mds = ko.observableArray([]);
		this.maker = MD.empty();
		this.tags = ko.observableArray([]);
		this.tag = {
			input: ko.observable('')
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
			this.tags.removeAll();
			for (const entity of entities) {
				this.tags.push(new Tag(entity));
			}
		});
	}

	search (tagId) {
		MD.search(tagId, (entities) => {
			this.mds.removeAll();
			for (const entity of entities) {
				this.mds.push(new MD(entity));
			}
			this.maker.deepCopy(MD.empty());
		});
	}

	append () {
		MD.create(this.maker.body(), (entity) => {
		    const md = new MD(entity);
			this.mds.push(md);
			this.maker.deepCopy(md);
		});
	}

	update () {
	    const md = this.mds().filter((self) => {
	        return self.id === this.maker.id;
	    }).pop();
	    if (md !== null) {
	        md.deepCopy(this.maker);
	        md.update();
	    }
	}
	
	delete (id) {
        MD.delete(id, (id) => {
			const target = this.mds.remove((self) => {
				return self.id === id;
			});
			console.log(`${target} deleted`);
		});
	}

	activate (page) {
		this.page(page);
	}

	tagged (self, e) {
		if (e.keyCode !== 13) {
			return true;
		}
		const tagName = this.tagMaker.name();
		const tag = this.tags().filter((self) => {
			return self.name() === tagName;
		}).pop();
		if (tag === null) {
		    Tag.create(tagName, (entity) => {
			    this.maker.tags.push(new Tag(entity));
		    });
		} else {
			this.maker.tags.push(tag);
		}
		this.tagMaker.name('');
		return false;
	}

	untagged (md, tag) {
	    MD.untagged(md.id, tag.id, (relation) => {
    		const target = md.tags.remove((self) => {
    			return tag.id === self.id;
    		});
    		console.log(`${target} untagged`);
	    });
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
