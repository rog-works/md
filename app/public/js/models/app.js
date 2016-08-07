class App {
	constructor () {
		this.console = new Console();
		this.page = ko.observable('index');
		this.mds = ko.observableArray([]);
		this.maker = MD.empty();
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
		MD.index((mds) => {
			this.mds.removeAll();
			for (const md of mds) {
				this.mds.push(new MD(md));
			}
		});
	}

	search (tagId) {
		MD.search(tagId, (mds) => {
			this.mds.removeAll();
			for (const md of mds) {
				this.mds.push(new MD(md));
			}
		});
	}

	append () {
		const body = this.maker.body();
		if (body.length === 0) {
			return;
		}
		MD.create(body, (md) => {
			this.mds.push(new MD(md));
			this.maker.deepCopy(MD.empty());
		});
	}

	update () {
		if (this.maker.id === -1) {
			return;
		}
		const body = this.maker.body();
		if (body.length === 0) {
			return;
		}
		MD.update(this.maker.id, body, () => {
			for (const md of this.mds()) {
				if (md.id === this.maker.id) {
					md.deepCopy(this.maker);
					break;
				}
			}
			this.maker.deepCopy(MD.empty());
		});
	}

	activate (page) {
		this.page(page);
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