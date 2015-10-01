var vis = false;

$(window).scroll(function() {
	// if ($('.ui.sticky.custom').position().top != 0 && false) 
	// {
	// 	$('.ui.sticky.custom')
	// 		.transition({
	// 			animation : 'fade up',
	// 		})
	// 	;
	// 	vis = true
	// };
	// console.log($('.ui.sticky.custom').position());
	// console.log($('.curtain-container').position());
	 //    $('.ui.sticky.custom')
	 //  		.transition('fade up')
		// ;
	
});


$('.button')
	.transition({
		animation : 'jiggle',
		duration : 800,
		interval : 200
	})
;

$('.ui.sticky')
	.sticky()
;

$('.ui.sticky.custom')
  .sticky({
    context: '#slide-3',
    offset       : 100,
    bottomOffset : 0,
  })
;

$('.ui.sticky.resume')
	.sticky({
		push:true
	})
;

$('.accordion')
	.accordion({
		selector: {
			trigger: '.title'
		}
	})
;

