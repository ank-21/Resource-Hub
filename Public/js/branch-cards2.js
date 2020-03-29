var smallnavbar = document.getElementById("smallnavbar");
var navtoggle = document.getElementById("navtoggle");
navtoggle.addEventListener("click", function(){
    if(smallnavbar.style.display == 'none'){
        smallnavbar.style.display = "block";
    }
    else {
        smallnavbar.style.display = "none";
        smallnavbar.style.transition = "1s ease-in-out"
    }
})