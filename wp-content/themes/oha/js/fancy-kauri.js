var $j = jQuery.noConflict();
$j(document).ready(function() {
	/*===== fancybox plugin ======= */
	$j('a.fancybox, a.group, a.zoom').fancybox({
		'transitionIn'	:	'fade',
		'transitionOut'	:	'fade',
		'speedIn'		:	300, 
		'speedOut'		:	300, 
		'overlayShow'	:	true,
		'titlePosition' :	'over',
		'padding'		:	0,
		'onComplete'	:	function () { $j('#fancybox-img').bind('contextmenu', function(e){return false;}); }
	});
	
	
	// Hide review form - it will be in a lightbox
	$j('#review_form_wrapper').hide();
	
	// Lightbox
	$j('a.zoom, a.show_review_form').fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600, 
		'speedOut'		:	200, 
		'overlayShow'	:	true
	});

});