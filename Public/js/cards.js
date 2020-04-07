//checks if element it is called on is visible (only checks horizontally
(function($) {
  var $window = $(window);
  
  $.fn.isVisible = function(){
    var $this = $(this),
      Left = $this.offset().left,
      visibleWidth = $window .width();

    return Left < visibleWidth;  
  }
})(jQuery);

(function($){
  var list = $('.portfolio-items'),
      showVisibleItems = function(){
      list.children('.item:not(.falldown)').each(function(el, i){
          var $this = $(this);
          if($this.isVisible()){
            $this.addClass('falldown');
          }
        });
      };
  
  //initially show all visible items before any scroll starts
  showVisibleItems();
  
  //then on scroll check for visible items and show them
  list.scroll(function(){
    showVisibleItems();
  });
  
  //image hover pan effect
  list.on('mousemove','img', function(ev){
      var $this = $(this),
          posX = ev.pageX, 
          posY = ev.pageY,
          data = $this.data('cache');
    //cache necessary variables
        if(!data){
          data = {};
          data.marginTop = - parseInt($this.css('top')),
          data.marginLeft = - parseInt($this.css('left')),
          data.parent = $this.parent('.view'),
          $this.data('cache', data); 
        }

    var originX = data.parent.offset().left,
        originY =  data.parent.offset().top;
    
       //move image
       $this.css({
          'left': -( posX - originX ) / data.marginLeft,
          'top' : -( posY - originY ) / data.marginTop
       }); 
  });
  
  
  list.on('mouseleave','.item', function(e){
    $(this).find('img').css({
      'left': '0', 
      'top' : '0'
    });
  });
  
  list.mousewheel(function(event, delta) {

      this.scrollLeft -= (delta * 60);
    
      event.preventDefault();

   });
})(jQuery);


window.onscroll = function() {myfunction()};

// Get the navbar
var navbar = document.getElementsByClassName("navbar");

// Get the offset position of the navbar
var sticky = navbar[0].offsetTop;

// Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myfunction() {
  if (window.pageYOffset >= sticky) {
    navbar[0].classList.add("sticky");
  } else {
    navbar[0].classList.remove("sticky");
  }
}

var sign = document.getElementsByClassName("signIn");
sign[0].addEventListener("click", function(){
  var fold = document.getElementsByClassName("fold");
  if(fold[0].style.display == "none"){
    fold[0].style.display =  "block";
  } else {
    fold[0].style.display = "none";
  }
})
