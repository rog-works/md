'use strict';

let LIB = {};
$(() => {
	class Console {
		constructor () {
			this.lines = ko.observableArray([]);
		}

		static init (id = 'console') {
			let self = new Console();
			ko.applyBindings(self, document.getElementById(id));
			self.bind();
			return self;
		}

		bind () {
			let self = this;
			const _log = console.log;
			const _error = console.error;
			console.log = (...args) => {
				_log.apply(console, args);
				self.put(...args);
			};
			console.error = (...args) => {
				_error.apply(console, args);
				self.put(...args);
			};
		}

		put (...args) {
			for (const arg of args) {
				this.lines.push(new ConsoleLine(arg));
			}
		}

		clear () {
			this.lines.removeAll();
		}
	}

	class ConsoleLine {
		constructor (data) {
			this.body = data.toString();
			this.expanded = ko.observable(true);
		}
		
		expand () {
			this.expanded(this.expanded());
		}
	}
	
	class App {
		constructor () {
			this.mode = ko.observable('index');
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
			MD.create(this.maker.body(), (md) => {
				this.mds.push(new MD(md));
				this.maker.body('');
			});
		}

		// XXX
		toggle () {
			const next = this.mode() === 'index' ? 'create' : 'index';
			this.mode(next);
		}

		// XXX
		decorate (body) {
			let elem = this.decorator(body);
			let blocks = $(elem).find('code');
			for (let block of blocks) {
				// FIXME
				Prism.highlightElement(block);
			}
			return elem;
		}
	}

	class MD {
		constructor (md) {
			this.id = md.id;
			this.title = ko.observable(md.title);
			this.body = ko.observable(md.body || '');
			this.tags = ko.observableArray(md.tags || '');
			this.closed = ko.observable(true);
		}

		static send (url, data, callback) {
			let _data = {
				url: `/md${url}`,
				type: 'GET',
				dataType: 'json',
				success: callback,
				error: (res, err) => {
					console.error(err, res.status, res.statusText, res.responseText);
				}
			};
			$.ajax($.extend(_data, data));
		}

		static index (callback) {
			let filter = ['id', 'title'].join('|');
			MD.send(
				`/.json?filter=${filter}`,
				{type: 'GET'},
				callback
			);
		}

		static search (tagId, callback) {
			let filter = ['id', 'title'].join('|');
			MD.send(
				`/search/${tagId}.json?filter=${filter}`,
				{type: 'GET'},
				callback
			);
		}

		static create (body, callback) {
			MD.send(
				'/',
				{type: 'POST', data: {body: body}}, 
				callback
			);
		}

		static empty () {
			return new MD({
				id: -1,
				title: ''
			});
		}

		toggle () {
			this.closed(!this.closed());
		}

		show (id) {
			if (this.body().length === 0) {
				this.load();
			}
			this.toggle();
		}

		load () {
			this.body('<img src="' + LIB.params.waitImgUrl + '" />');
			MD.send(
				`/${this.id}.json`,
				{},
				(md) => {
					this.id = md.id;
					this.body(LIB.app.decorate(md.body));
					this.tags.removeAll();
					// FIXME
					for (const tag of (md.tags || [])) {
						this.tags.push({id: tag.id, name: tag.name, search: () => { LIB.app.search(this.id); }});
					}
				}
			);
		}
	}

	try {
		LIB = $.extend({
			params: {
				waitImgUrl: 'https://dujrsrsgsd3nh.cloudfront.net/img/emoticons/waiting-1417756997.gif'
			},
			console: Console.init(),
			app: App.init()
		});
		console.log('launched!!');
	} catch (error) {
		console.error(error.message, error.stack);
	}
});
