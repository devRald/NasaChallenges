var mapp = angular.module("GMaps",[])
	.factory("$myGmaps",function(){
		var map;
		var latitude,longitude;
		var infoWindow;

		//functions
		

      	initMap();

		var getLat = function(){
			console.log(latitude);
		}

		return{
			
		};
	});