var smallnavbar = document.getElementById("smallnavbar");
var navtoggle = document.getElementById("navtoggle");
navtoggle.addEventListener("click", function(){
    if(smallnavbar.style.display == 'none'){
        smallnavbar.style.display = "flex";
        smallnavbar.style.justifyContent ="center";
    }
    else {
        smallnavbar.style.display = "none";
        smallnavbar.style.transition = "1s ease-in-out"
    }
})

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