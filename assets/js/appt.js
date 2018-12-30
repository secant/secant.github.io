$("#appointment").fancybox({
    'onStart': function() {$("#appt").css("display","block");},
    'onClosed': function() {$("#appt").css("display","none"); },
    'scrolling'   : 'no',
    'openEffect' : 'none',
    'closeEffect' : 'none',
    helpers : {
        overlay : {
            locked : false,
            css: {'opacity': '0.0'},
        }
    },
});
