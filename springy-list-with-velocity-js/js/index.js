function init() {
  var $listItems = $('#list li');
  var $line = $('#line');
  
  animateIn();
  addListeners();
  
  function animateIn() {
    $listItems.each(function(i) {
      this.index = i;
      $(this).velocity({translateX: [i*100+'px', [ 250, 15 ]], opacity: [1, {ease: 'linear', duration: 400}], rotation: '30deg'}, {delay: 1000+(500-(i*100)), duration: 2000, easing: [ 250, 15 ], queue: false});
  	});
     $line.velocity({width: 500}, {duration: 2000, easing: [ 250, 15 ], delay: 1000});
  }
	
  function addListeners() {
    $listItems.on('mouseenter', over).on('mouseleave', out);
  }
  
  function over() {
    var hoverIndex = this.index;
    this.getElementsByTagName("p")[0].style.visibility = "visible"
    console.log(this.getElementsByTagName("p")[0].innerHTML);
    $(this).velocity({scale: 1.4}, {duration: 300, easing: 'easeOutCubic', queue: false});

    $listItems.each(function(i) {
      if(hoverIndex != i) {
         $(this).velocity({translateX: (i*100)-(18/(hoverIndex-i))+'px'}, {duration: 900, easing: [ 250, 15 ], queue: false});
      }
    });
  }

  function out() {
    var hoverIndex = this.index;
    this.getElementsByTagName("p")[0].style.visibility = "hidden"
    $(this).velocity({scale: 1},{duration: 300, easing: 'easeOutCubic', queue: false});

    $listItems.each(function(i) {
      if(hoverIndex != i) {
        $(this).velocity({translateX: (i*100)+'px'}, {queue: false, duration: 900, easing: [ 250, 15 ]});
      }
    });
  }
}

$(document).on('ready', init);