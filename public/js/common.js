 /* Set the default number of slides */
my_min_slides = 3;
my_max_slides = 3;
my_move_slides = 1;
sl_width = 318;
sl_mar = 50

/* If it is a small screen, set the variables to show just 1 slide */
if($(window).innerWidth() <= 990) {
    my_min_slides = 2;
    my_max_slides = 2;
    my_move_slides = 1;
}

if($(window).innerWidth() <= 670) {
    my_min_slides = 1;
    my_max_slides = 1;
    my_move_slides = 1;
	sl_width = 600;
sl_mar = 0
}

	
	$(function(){
  $('.slider').bxSlider({
    auto: true,
	controls: false,
    autoControls: false,
    speed: 2000, 
    slideSelector: 'div.item',
    minSlides: my_min_slides,
        maxSlides: my_max_slides,
        moveSlides: my_move_slides,
    slideWidth: sl_width,
	slideMargin: sl_mar,
	responsive: true
  });
});
	
	
/* Key Features */

 
/* Set the default number of slides */
my_min_slides2 = 2;
my_max_slides2 = 2;
my_move_slides2 = 1;
sl_width2 = 660;
sl_mar2 = 30

/* If it is a small screen, set the variables to show just 1 slide */

	

if($(window).innerWidth() <= 670) {
    my_min_slides2 = 1;
    my_max_slides2 = 1;
    my_move_slides2 = 1;
	sl_width2 = 600;
sl_mar2 = 10
}

 

$(document).ready(function(){
	 if($(window).width() <= 768){
          $(function(){
  $('.multigrid-slide-box').bxSlider({
    auto: true,
	controls: false,
    autoControls: false,
    speed: 500, 
    slideSelector: 'div.item',
    minSlides: my_min_slides2,
        maxSlides: my_max_slides2,
        moveSlides: my_move_slides2,
    slideWidth: sl_width2,
	slideMargin: sl_mar2,
	responsive: true,
	adaptiveHeight: true
	 
  }); 
});
        }
	
	
    $(window).resize(function(){
        console.log($(window).width());
        if($(window).width() <= 768){
          $(function(){
  $('.multigrid-slide-box').bxSlider({
    auto: true,
	controls: false,
    autoControls: false,
    speed: 500, 
    slideSelector: 'div.item',
    minSlides: my_min_slides2,
        maxSlides: my_max_slides2,
        moveSlides: my_move_slides2,
    slideWidth: sl_width2,
	slideMargin: sl_mar2,
	responsive: true,
	adaptiveHeight: true
	 
  }); 
});
        }
    });
});





	 slider_fr = $(".bxSlider").bxslider();
 
$(window).resize(function(){
   slider_fr.reloadSlider(".slider");
   slider_fr.reloadSlider(".multigrid-slide-box");
});  


 
    $(window).resize(function(){
        console.log($(window).width());
        if($(window).width() <= 670){
			alert('size:')
            
        }
    });
 