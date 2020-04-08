/*global $, document, window, setTimeout, navigator, console, location*/
$(document).ready(function () {

    'use strict';

    var usernameError = true,
        emailError    = true,
        passwordError = true,
        passConfirm   = true;

    // Detect browser for css purpose
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
        $('.form form label').addClass('fontSwitch');
    }

    // Label effect
    $('input').focus(function () {

        $(this).siblings('label').addClass('active');
    })
    // Form validation
    // $('input').blur(function () {

        // User Name
        // if ($(this).hasClass('name')) {
        //     if ($(this).val().length === 0) {
        //         $(this).siblings('span.error').text('Please type your full name').fadeIn().parent('.form-group').addClass('hasError');
        //         usernameError = true;
        //     } else if ($(this).val().length > 1 && $(this).val().length <= 6) {
        //         $(this).siblings('span.error').text('Please type at least 6 characters').fadeIn().parent('.form-group').addClass('hasError');
        //         usernameError = true;
        //     } else {
        //         $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
        //         usernameError = false;
        //     }
        // }
        // Email
        // if ($(this).hasClass('email')) {
        //     if ($(this).val().length == '') {
        //         $(this).siblings('span.error').text('Please type your email address').fadeIn().parent('.form-group').addClass('hasError');
        //         emailError = true;
        //     } else {
        //         $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
        //         emailError = false;
        //     }
        // }

        // PassWord
        // if ($(this).hasClass('pass')) {
        //     if ($(this).val().length < 8) {
        //         $(this).siblings('span.error').text('Please type at least 8 charcters').fadeIn().parent('.form-group').addClass('hasError');
        //         passwordError = true;
        //     } else {
        //         $(this).siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
        //         passwordError = false;
        //     }
        // }

        // PassWord confirmation
    //     if ($('.pass').val() !== $('.passConfirm').val()) {
    //         $('.passConfirm').siblings('.error').text('Passwords don\'t match').fadeIn().parent('.form-group').addClass('hasError');
    //         passConfirm = false;
    //     } else {
    //         $('.passConfirm').siblings('.error').text('').fadeOut().parent('.form-group').removeClass('hasError');
    //         passConfirm = false;
    //     }

    //     // label effect
    //     if ($(this).val().length > 0) {
    //         $(this).siblings('label').addClass('active');
    //     } else {
    //         $(this).siblings('label').removeClass('active');
    //     }
    // });


    // form switch
    $('a.switch').click(function (e) {
        $(this).toggleClass('active');
        e.preventDefault();

        if ($('a.switch').hasClass('active')) {
            $(this).parents('.form-peice').addClass('switched').siblings('.form-peice').removeClass('switched');
        } else {
            $(this).parents('.form-peice').removeClass('switched').siblings('.form-peice').addClass('switched');
        }
    });


    // Form submit
    // $('form.signup-form').submit(function (event) {
    //     event.preventDefault();

    //     if (usernameError == true || emailError == true || passwordError == true || passConfirm == true) {
    //         $('.name, .email, .pass, .passConfirm').blur();
    //     } else {
    //         $('.signup, .login').addClass('switched');

    //         setTimeout(function () { $('.signup, .login').hide(); }, 700);
    //         setTimeout(function () { $('.brand').addClass('active'); }, 300);
    //         setTimeout(function () { $('.heading').addClass('active'); }, 600);
    //         setTimeout(function () { $('.success-msg p').addClass('active'); }, 900);
    //         setTimeout(function () { $('.success-msg a').addClass('active'); }, 1050);
    //         setTimeout(function () { $('.form').hide(); }, 700);
    //     }
    // });

    // Reload page
    $('a.profile').on('click', function () {
        location.reload(true);
    });


});

function passwordfnlog(){
    var x = document.getElementById("loginPassword");
    var y = document.getElementById("hide1");
    var z = document.getElementById("hide2");
    if(x.type === 'password'){
        x.type = "text";
        y.style.display = "block";
        z.style.display = "none";
    } else {
        x.type = "password";
        y.style.display = "none";
        z.style.display = "block";
    }
}

var eye = document.getElementById("eye");
var x = document.getElementById("password");
x.addEventListener("click", function(){
    eye.style.display = "block";
})

var eye1 = document.getElementById("eye1");
var x = document.getElementById("loginPassword");
x.addEventListener("click", function(){
    eye1.style.display = "block";
})

function passwordfnsign(){
    var x1 = document.getElementById("password");
    var y1 = document.getElementById("hide3");
    var z1 = document.getElementById("hide4");
    if(x1.type === 'password'){
        x1.type = "text";
        y1.style.display = "block";
        z1.style.display = "none";
    } else {
        x1.type = "password";
        y1.style.display = "none";
        z1.style.display = "block";
    }
}