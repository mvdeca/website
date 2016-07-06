$(document).ready(function(){
  $('#img-container').pushpin({ top: $('#img-container').offset().top, bottom: $('#img-container').offset().top*3 });
  

  $(window).on('scroll', function() {
    if(window.pageYOffset < 1.5 * $(window).height()) {
      $('#content-img1').fadeIn();
      $('#content-img2').fadeOut();
      $('#content-img3').fadeOut();
    } else if(window.pageYOffset < 2.5 * $(window).height()) {
      $('#content-img1').fadeOut();
      $('#content-img2').fadeIn();
      $('#content-img3').fadeOut();
    } else {
      $('#content-img1').fadeOut();
      $('#content-img2').fadeOut();
      $('#content-img3').fadeIn();
    }
  })
});