var Escalator = (function($, undefined){

	var _getFloor = function(t){
		return $(t).parents('tr').attr('data-floor');
	}

	var _getLiftRef = function(t){
		return $(t).attr('data-lift');
	}

	var _move = function(lift, targetfloor){
		//variables
		var sourcefloorref = parseInt(_getFloor(lift),10),
			sourcefloor = $('tr[data-floor='+sourcefloorref+']'),
			liftsonfloor = parseInt(sourcefloor.attr('data-liftcount'),10),
			liftref = _getLiftRef(lift),		
			i = sourcefloorref,
			targetfloorref = parseInt(targetfloor,10),
			targetfloor = $('tr[data-floor='+targetfloorref+']'),
			topStatus = $('thead th.status').eq(liftref-1);

		//actions
		$(lift).removeClass('stopped');
		
		sourcefloor.attr('data-liftcount', liftsonfloor-1);		
		if (sourcefloor.attr('data-liftcount')==0){
			sourcefloor.find('select').removeClass('show');	
		}	
			
		var interval = setInterval(function() {
			
			$('tr[data-floor='+i+']').find('td[data-lift='+liftref+']').removeClass('moving');	
			
			if ( sourcefloorref > targetfloorref ) {i--; topStatus.find('p').removeClass('arrow-up arrow-down').addClass('arrow-down')}
			else if ( sourcefloorref < targetfloorref ) {++i; topStatus.find('p').removeClass('arrow-up arrow-down').addClass('arrow-up')}
				
		    $('tr[data-floor='+i+']').find('td[data-lift='+liftref+']').addClass('moving');	
		    
		    if(i===targetfloorref) {
		        clearInterval(interval);
		        //alert("Code to be executed after completing loop");
		       targetfloor.find('td[data-lift='+liftref+']').removeClass('moving').addClass('stopped');	
		       targetfloor.attr('data-liftcount', parseInt(targetfloor.attr('data-liftcount'),10)+1);
		        targetfloor.find('select').addClass('show');
		        topStatus.find('p').removeClass('arrow-up arrow-down');
		    }
		}, 1500);
	}
	

	var _callToFloor = function(t){
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
		//_move(nearest, currentref);
		
		if ( floorref !== currentref) {
			_move(nearest, currentref);
		} 

	}

	var _selectFloor = function(t){
		var sourceref = _getFloor(t);
		var targetref = parseInt($(t).val(),10);
		var thislift =  $('tr[data-floor='+sourceref+']').find('.lift.stopped').eq(0);
		if ( sourceref !== targetref) {
			_move(thislift, targetref);
		} 
	}

	var _bindEvents = function(){
		$('table').on('click', 'button', function(e){
			e.preventDefault();
			console.log('current floor: ' + _getFloor(this));
			_callToFloor(this);
		}).on('change', 'select', function(){
			_selectFloor(this);
		})

	}

	var _init = function(){

		_bindEvents();


	}

	return {
		init: _init
	}

})(jQuery, undefined)
