var Escalator = (function($, undefined){

	var _getFloor = function(t){
		return $(t).parents('tr').attr('data-floor');
	}

	var _getLiftRef = function(t){
		return $(t).attr('data-lift');
	}
	
	var _moveUp = function(lift, floorref){
		$(lift).removeClass('stopped');
		var liftref = _getLiftRef(lift);		
		var i = floorref;
		var interval = setInterval(function() {
			//$('tr[data-floor='+(i-1)+']').find('td[data-lift='+liftref+']').removeClass('moving');	
		    $('tr[data-floor='+i+']').find('td[data-lift='+liftref+']').addClass('moving');	
		    i++;
		    if(i>floorref) {
		        clearInterval(interval);
		        //alert("Code to be executed after completing loop");
		        $('tr[data-floor='+floorref+']').find('td[data-lift='+liftref+']').removeClass('moving').addClass('stopped');	
		    }
		}, 1500);


	}
	var _moveDown = function(lift, floorref){
		$(lift).removeClass('stopped');
		var liftref = _getLiftRef(lift);
		var i = floorref;
		var interval = setInterval(function() {
			//$('tr[data-floor='+(i+1)+']').find('td[data-lift='+liftref+']').removeClass('moving');	
		    $('tr[data-floor='+i+']').find('td[data-lift='+liftref+']').addClass('moving');	
		    i--
		    if(i<floorref) {
		        clearInterval(interval);
		        //alert("Code to be executed after completing loop");
		        $('tr[data-floor='+floorref+']').find('td[data-lift='+liftref+']').removeClass('moving').addClass('stopped');	
		    }
		}, 1500);
	}

	var _getNearest = function(t){
		var currentref = _getFloor(t);
		var first = $('.lift.stopped').eq(0);
		var nearest = first;
		console.log(first);
		$('.lift.stopped').each(function(e){
			if (Math.abs(_getFloor(this) - currentref) < Math.abs(_getFloor(nearest) - currentref )){
				nearest = this;
			}
		});
		var floorref = _getFloor(nearest);
		console.log('Nearest lift is on: ' + floorref + ' and cu');
		if ( floorref < currentref) {
			_moveUp(nearest, currentref);
		} else {
			_moveDown(nearest, currentref);
		}

	}

	var _bindEvents = function(){
		$('table').on('click', 'button', function(e){
			e.preventDefault();
			console.log('current floor: ' + _getFloor(this));
			_getNearest(this);
		})
	}

	var _init = function(){

		_bindEvents();


	}

	return {
		init: _init
	}

})(jQuery, undefined)
