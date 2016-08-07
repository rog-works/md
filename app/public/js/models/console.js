class Console {
	constructor () {
		this.lines = ko.observableArray([]);
		this.bind();
	}

	static init (id = 'console') {
		let self = new Console();
		ko.applyBindings(self, document.getElementById(id));
		return self;
	}

	bind () {
		const self = this;
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
