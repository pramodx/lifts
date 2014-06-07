var Escalator = (function($, undefined){
	//Generic function to get floor index
	var _getFloor = function(t){
		return $(t).parents('tr').attr('data-floor');
	}
	//generic function to get reference id of a lift
	var _getLiftRef = function(t){
		return $(t).attr('data-lift');
	}
	//Movement of lifts
	var _move = function(lift, targetfloor){
		//variables caching
		var sourcefloorref = parseInt(_getFloor(lift),10),
		sourcefloor = $('tr[data-floor='+sourcefloorref+']'),
		people = sourcefloor.find('input[type=text]').val(),
		liftsonfloor = parseInt(sourcefloor.attr('data-liftcount'),10),
		liftref = _getLiftRef(lift),		
		i = sourcefloorref,
		targetfloorref = parseInt(targetfloor,10),
		targetfloor = $('tr[data-floor='+targetfloorref+']'),
		topStatus = $('thead th.status').eq(liftref-1);


		//actions
		$(lift).removeClass('stopped');		
		sourcefloor.attr('data-liftcount', liftsonfloor = liftsonfloor-1 < 0 ? 0 : liftsonfloor - 1  );		
		if (sourcefloor.attr('data-liftcount')==0){
			sourcefloor.find('select, .select').removeClass('show');	
		}	

		var interval = setInterval(function() {
			//set the condition as not moving
			$('tr[data-floor='+i+']').find('td[data-lift='+liftref+']').removeClass('moving').text('');	
			
			//set arrow positions up or down
			if ( sourcefloorref > targetfloorref ) {i--; topStatus.find('p').removeClass('arrow-up arrow-down').addClass('arrow-down')}
			else if ( sourcefloorref < targetfloorref ) {++i; topStatus.find('p').removeClass('arrow-up arrow-down').addClass('arrow-up')}

			//set lift to moving to allow concurrent movements of lifts. 
			$('tr[data-floor='+i+']').find('td[data-lift='+liftref+']').addClass('moving').text(people);	


			if(i===targetfloorref) {
				clearInterval(interval);
		        //alert("Code to be executed after completing loop");
		        targetfloor.find('td[data-lift='+liftref+']').removeClass('moving').addClass('stopped');	
		        sourcefloor.find('input[type=text]').val('');
		        _dbdata.setData(liftref, targetfloorref);

		        targetfloor.attr('data-liftcount', parseInt(targetfloor.attr('data-liftcount'),10)+1);
		        targetfloor.find('select, .select').addClass('show');
		        topStatus.find('p').removeClass('arrow-up arrow-down');
		    }
		}, 1000);
	}
	
	//called on button press
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

	//generic getter setter for db updates and retrievals
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
						_updateStatus(data);
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

	//trigger lift based on floor selection through dropdown
	var _selectFloor = function(t){
		var sourceref = _getFloor(t),
			floor = $('tr[data-floor='+sourceref+']'),
		 	targetref = parseInt(floor.find('select').val(),10);
		var thislift =  floor.find('.lift.stopped').eq(0);
		if ( sourceref !== targetref) {
			_move(thislift, targetref);
		} 
	}

	//generic bindingof events
	var _bindEvents = function(){
		$('table').on('click', 'button', function(e){
			e.preventDefault();
			_callToFloor(this);
		}).on('click', '.select', function(){
			if ($(this).parents('tr').find('input[type=text]').val()===''){
				alert('Please select number of passengers');
				return false;
			} else {
				_selectFloor(this);
			}
		})

		$('.fetchFloors').on('click', function(){
			_fetchfromdb();
		})

		$('input[type=text]').on('keypress', _validateInput  ).on('blur', function(e){
			if ( $(this).val() > 20 ){
				alert('Maximum 20 passengers allowed!');
				$(this).val('');
				return false;
			}
		})

	}

	//create object to work on the db updates
	var _dbdata = new _rest();

	//validate passenger input to accept only numbers
	var _validateInput = function (e) {
	
		var charCode = (e.which) ? e.which : event.keyCode
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	} 

	//button press function to sync with db. Try pressing on different browsers.
	var _fetchfromdb = function(){
		var data = _dbdata.getData();
	}
	
	//reset the lift positions based on data stored in db
	var _updateStatus = function(data){
		//run loop to clear current status;
		var present = $('tr').filter(function(){
			return $(this).attr('data-liftcount') > 0;
		})
		$.each(present, function(){
			$(this).attr('data-liftcount',0).find('td.stopped').removeClass('stopped');
			$(this).find('select, .select').removeClass('show');
		})
		$.each(data, function(i){
			var floor = $('tr[data-floor='+data[i].floor+']'),
				liftcount = parseInt(floor.attr('data-liftcount'),10);
			
			floor.attr('data-liftcount', liftcount+1).find('select, .select').addClass('show');
			floor.find('td[data-lift='+data[i]._id+']').addClass('stopped');
		})

	}

	//bind events on start
	var _init = function(){
		_bindEvents();
	}

	return {
		init: _init,
		dbdata: _dbdata,
		fetchfromdb: _fetchfromdb
	}

})(jQuery, undefined)
