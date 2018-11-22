$(document).ready(function() {
  var duration = 200;

  $('.back-to-top').click(function(event) {
    event.preventDefault();
    $('html, body').animate({scrollTop: 0}, duration);
    return false;
  });

  window.addEventListener("scroll", function() {
    if (window.scrollY >= 10) {
      $('.back-to-top').show(duration);
    } else {
      $('.back-to-top').hide(duration);
    }
  });
});
