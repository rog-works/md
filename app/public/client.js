'use strict';

$(() => {
	var params = {
		waitImgUrl: 'https://dujrsrsgsd3nh.cloudfront.net/img/emoticons/waiting-1417756997.gif'
	};
	
	console.log('hello world :o');
	
	$.get('/dreams', (dreams) => {
		dreams.forEach((dream) => {
			$('<li></li>').text(dream).appendTo('ul#dreams');
		});
	});

	$('form#dream').submit((event) => {
		var that = $('form#dream'),
			input = that.find('input');
		event.preventDefault();
		dream = input.val();
		$.post('/dreams?' + $.param({dream: dream}), () => {
			$('<li></li>').text(dream).appendTo('ul#dreams');
			input.val('');
			input.focus();
		});
	});

	$('a').bind('click', (event) => {
		event.preventDefault();
		$.get('dreams/d', (dreams) => {
			$('ul#dreams').innerHtml = '';
			for(let i in dreams) {
				$('<li></li>').text(dreams[i]).appebdTo('ul#dreams');
			}
		});
	})

	$('form#2word').submit((event) => {
		event.preventDefault();
		let that = $(event.toElement);
		let input = that.find('input');
		let w = input.val();
		let out = $('section.2words');
		out.html('<img src="' + params.waitImgUrl + '" />');
		$.get('/ww?' + $.param({word:w}), (res) => {
			out.text(res);
			input.val('');
		});
	});
	
	let onMDReload = () => {
		$.get('/md/.json', (res) => {
			let out = $('ul#md-index');
			out.html('<img src="' + params.waitImgUrl + '" />');
			let lis = [];
			for (let i in res) {
				let e = res[i];
				let li = '<li><a href="/md/' + e.id + '">' + '[' + e.id + '] ' + e.title + '</a></li>'
				lis += li;
			}
			out.html(lis);
			out.find('li > a').on('click', (event) => {
				event.preventDefault();
				let that = $(event.toElement);
				let id = that.attr('href').match(/[\d]+$/);
				onMDShow(id);
			});
		});
	};
	
	(function () {
		onMDReload();
	}());
	
	let onMDShow = (id) => {
		let that = $('form#md-show');
		let out = $('section.md');
		out.html('<img src="' + params.waitImgUrl + '" />');
		$.get('/md/' + id, (res) => {
			//onMDUpdate(out, res.md);
			let outTags = $('section.md-tags');
			let tagsLi = res.tags.map((self) => {
				return '<li><a href="#' + self.id + '">' + self.name + '</a></li>'
			});
			let tagsUl = '<ul>' + tagsLi.join('') + '</ul>';
			outTags.html(tagsUl);
			onMDUpdate(out, res.md);
		});
	};
	
	$('form#md-show').submit((event) => {
		event.preventDefault();
		let that = $(event.toElement);
		let input = that.find('input');
		let id = input.val();
		onMDShow(id);
		input.val('');
	});
	
	$('form#md-create').submit((event) => {
		event.preventDefault();
		let that = $(event.toElement);
		let input = that.find('textarea');
		let md = input.val();
		let out = $('section.md');
		out.html('<img src="' + params.waitImgUrl + '" />');
		$.post('/md', {md:md}, (res) => {
			onMDUpdate(out, res.md);
			onMDReload();
		});
	});
	
	marked.setOptions({
		langPrefix: 'language-'
	});
	
	let onMDUpdate = (e, md) => {
		e.html(marked(md));
		let blocks = e.find('pre > code');
		blocks.parent('pre').addClass('line-numbers');
		for (let i in blocks) {
			Prism.highlightElement(blocks[i]);
		}
	};
	
});
