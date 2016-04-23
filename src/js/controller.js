app.controller("MainCtrl",function($scope,$rootScope){
	
	$scope.openNav = function(){
		$('.button-collapse').sideNav({
		    menuWidth: 300, // Default is 240
		    edge: 'left', // Choose the horizontal origin
		    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
		  }
		);
	}
})
.controller("MapsCtrl",function($scope,$rootScope){
	$scope.initMap = function() {
	    $scope.map = new google.maps.Map(document.getElementById('gmaps'), {
	      center: {lat: 5, lng: 10},
	      zoom: 15
	    });
    }

    $scope.initLocationProcedure = function(){
        $scope.initMap();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.displayAndWatch);
        } else {
            alert("Your browser does not support the Geolocation API");
        }
    }

    $scope.displayAndWatch = function(position) {
        // set current position
        $scope.setCurrentPosition(position);
        // watch position
        $scope.watchCurrentPosition();
    }

    $scope.setMarkerPosition = function(marker, position) {
        marker.setPosition(
            new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude)
        );
    }

    $scope.watchCurrentPosition = function() {
        var positionTimer = navigator.geolocation.watchPosition(
            function (position) {
            	console.log(position);
                $scope.setMarkerPosition(
                    $scope.currentPositionMarker,
                    position
                );
            });
    }

    $scope.setCurrentPosition = function(pos) {
        $scope.currentPositionMarker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(
                pos.coords.latitude,
                pos.coords.longitude
            ),
            title: "Current Position"
        });
        $scope.map.panTo(new google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
        ));
    }

    $scope.initLocationProcedure();
})