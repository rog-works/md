'use strict';

let LIB = {};
$(() => {
	try {
		LIB = $.extend({
			params: {
				waitImgUrl: 'https://dujrsrsgsd3nh.cloudfront.net/img/emoticons/waiting-1417756997.gif'
			},
			app: App.init()
		});
		console.log('launched!!');
	} catch (error) {
		console.error(error.message, error.stack);
	}

	// XXX 
	const onResize = (e) => {
		const w = window.innerWidth;
		const h = window.innerHeight;
		const main = $('#md-main');
		main.width(w);
		main.height(h);
		// XXX -32px for page
		for (const e of $('.page')) {
			$(e).width(w - 32);
		}
	};
	onResize(null);

	$(window).on('resize', onResize);
});
