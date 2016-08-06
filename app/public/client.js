'use strict';

let LIB = {};
$(() => {
	LIB = $.extend({
	    params: {
	    	waitImgUrl: 'https://dujrsrsgsd3nh.cloudfront.net/img/emoticons/waiting-1417756997.gif'
	    },
	    debug: Debugger.init(),
	    app: App.init()
	});
	
	class Debugger {
	    constructor () {
	        this.lines = ko.observableArray([]);
	    }
	    
	    static bind (handler) {
	        console.log = handler.put;
	    }
	    
	    put (...args) {
	        for (const arg of args) {
	            this.lines.push(new DebugLine(arg));
	        }
	    }
	    
	    clear () {
	        this.lines.removeAll();
	    }
	    
	    static init (id = 'debug') {
	        let self = new Debug();
	        ko.applyBindings(self);
	        Debug.bind(self);
	        return self;
	    }
	}
	
	class DebugLine {
	    constructor (data) {
	        this.body = data.toString();
	        this.expanded = ko.observable(true);
	    }
	    
	    toggle () {
	        this.expanded(this.expanded());
	    }
	}
	
	class App {
	    constructor () {
	        this.mode = ko.observable('index');
	        this.mds = ko.observableArray([]);
	        this.maker = ko.observable(new MD({
	            id: -1,
	            title: '',
	            body: '',
	            tags: []
	        }));
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
    		$.ajax({
    		    url: 'localhost:18081/md/.json',
    		    type: 'GET',
    		    dataType: 'json',
    		    success: (mds) => {
        		    this.mds.removeAll();
        			for (const md of mds) {
        			    this.mds.push(new MD(md));
        			}
    		    },
    		    error: (res, err) => {
    		        this.maker.body(err);
    		    }
    		});
	    }
	    
	    append () {
			MD.create(this.maker.body(), (err, md) => {
			    if (err === null) {
			        this.mds.push(new MD(md));
    		    	this.maker.body('');
			    } else {
			        this.maker.body(err);
			    }
			});
	    }
	    
	    toggle () {
	        const next = this.mode() === 'index' ? 'create' : 'index';
	        this.mode(next);
	    }
	    
	    // XXX
	    decorate (body) {
	        let elem = this.decorator(body);
	        let blocks = $(elem).find('code');
	        for (let block of blocks) {
	            Prism.highlightElement(block);
	        }
	        return elem;
	    }
	}
	
	class MD {
	    constructor (md) {
	        this.id = md.id;
	        this.title = ko.observable(md.title);
	        this.body = ko.observable(md.body);
	        this.tags = ko.observableArray(md.tags);
	        this.closed = ko.observable(true);
	    }
	    
    	show (id) {
    	    if (this.body().length === 0) {
    	        this._show();
    	        this.closed(false);
    	    } else {
    	        this.closed(!this.closed());
    	    }
    	}
    	
    	_show () {
    		this.body('<img src="' + LIB.params.waitImgUrl + '" />');
    		$.ajax({
    		    url: `:18081/md/${this.id}.json`,
    		    success: (md) => {
        	        this.id = md.id;
        	        this.body(LIB.app.decorate(md.body));
        	        this.tags.removeAll();
        	        for (const tag of md.tags) {
        	            this.tags.push(tag);
        	        }
        		},
        		error: (res, err) => {
        		    LIB.app.maker.body(err);
        		}
        	});
    	}
	    
    	static create (body, callback) {
    		let fd = new FormData();
    		fd.append('body', body);
    		$.ajax({
    		    url: ':18081/md',
    		    type: 'POST',
    		    data: fd, 
    		    dataType: 'json',
    		    success: (res) => {
    		        callback(null, res);
        		},
        		error: (res, err) => {
        		    callback(err, null);
        		}
    		});
    	}
	}
});
