(function($){

  $.fn.fullHeight = function(offset){

    var self = this;
    var windowHeight = $(window)[0].innerHeight;

    var fullHeightFunction = function(){
      return self.each(function() {
        self.css({
          'height': windowHeight - offset
        });
      });
    }

    $(window).on('resize', function(){
      windowHeight = $(window)[0].innerHeight;
      fullHeightFunction();
    });

    fullHeightFunction();
    return self;
    
  }

})(jQuery);