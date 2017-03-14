jQuery(document).ready(function($){
	//open menu
	$(document).on('click','.menu-trigger', function(event){
		$('#main-content').addClass('move-out');
		$('#main-nav').addClass('is-visible');
		$('.shadow-layer').addClass('is-visible');
    	event.preventDefault();
	});
	//close menu
	$(document).on('click', '.menu', function(event) {
		$('.close-menu').trigger('click');
	});
	$(document).on('click','.close-menu', function(event){
		$('#main-content').removeClass('move-out');
		$('#main-nav').removeClass('is-visible');
		$('.shadow-layer').removeClass('is-visible');
    event.preventDefault();
	});
	//clipped image - blur effect
	set_clip_property();
	$(window).on('resize', function(){
		set_clip_property();
	});

	function set_clip_property() {
		var $header_height = $('.header').height(),
			$window_height = $(window).height(),
			$header_top = $window_height - $header_height,
			$window_width = $(window).width();
		$('.blurred-bg').css('clip', 'rect('+$header_top+'px, '+$window_width+'px, '+$window_height+'px, 0px)');
	}
});
