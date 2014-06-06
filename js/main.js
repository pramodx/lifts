var Escalator = (function($, undefined){
	var _dbUpdate = true;
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
		       if (_dbUpdate){
		       	_dbdata.setData(liftref, targetfloorref);
		       }
		       targetfloor.attr('data-liftcount', parseInt(targetfloor.attr('data-liftcount'),10)+1);
		        targetfloor.find('select').addClass('show');
		        topStatus.find('p').removeClass('arrow-up arrow-down');
		    }
		}, 1000);
	}
	

	var _callToFloor = function(t){
		var currentref = _getFloor(t);
		var first = $('.lift.stopped').eq(0);
		var nearest = first;
		
		$('.lift.stopped').each(function(e){
			if (Math.abs(_getFloor(this) - currentref) < Math.abs(_getFloor(nearest) - currentref )){
				nearest = this;
			}
		});
		var floorref = _getFloor(nearest);
		
		if ( floorref !== currentref) {
			_move(nearest, currentref);
		} 

	}

	var _rest = function (argument) {
		var apiKey = 'SUNCexY8jmspBkpwUsua0ymB_vVipNNI',
			_id = '5391cf44e4b0d4536359e35b',
			url = 'https://api.mongolab.com/api/1/databases/pramodx/collections/elevators/?apiKey=' + apiKey;// + '&u=true&q={_id:' + _id + '}';
		this.data
		this.getData = function(){
			
			var _self = this;
			$.ajax({
				url: url,
				dataType: 'json',
				async: false,
				type: 'get',
				crossDomain: true,
				success: function(data){
					$(data).each( function(i){
						$('tr[data-floor='+data[i].floor+']').find('button').click();
					});
				},
				error: function(e){
					console.log(e);
				}
			})
			//return data;
		}

		this.setData = function(idx, floor){
			
			$.ajax({ 
				url: url + '&u=true&q={_id:' + idx + '}',
	  			data: JSON.stringify( { "$set" : { "floor" : floor } } ),
	  			type: 'put',
	  			contentType: "application/json",
	  			crossDomain: true,
	  			success: function(){
	  				console.log('Data Entered');
	  			},
	  			error: function(e){
	  				console.log(e);
	  			}
	  		});
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
			_callToFloor(this);
		}).on('change', 'select', function(){
			_selectFloor(this);
		})

		$('.fetchFloors').on('click', function(){
			_fetchfromdb();
		})

	}

	var _dbdata = new _rest();

	var _fetchfromdb = function(){
		_dbUpdate = false;
		var data = _dbdata.getData();
		_dbUpdate = true;
	}
	

	var _init = function(){
		_bindEvents();
	}

	return {
		init: _init,
		dbdata: _dbdata,
		fetchfromdb: _fetchfromdb
	}

})(jQuery, undefined)
