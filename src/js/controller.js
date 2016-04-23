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
.controller("MediaCtrl",function($scope,$rootScope,$http){
    $('.carousel').carousel({dist:0});
})
.controller("LoginCtrl",function($scope,$rootScope,$http,$location){
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    $scope.userLogin = function(){
        $http.get("http://localhost/ajaximg/login.php?username="+$scope.username+"&password="+$scope.password).then(function(response){
            if(response.data!="invalid"){
                sessionStorage.setItem("userdata",JSON.stringify(response.data));
                $location.path("/home");
            }
            else{
                console.log("invalid credentials");
            }
        });
    }

    $scope.userSignup = function(){
        console.log($scope.user);
        $http.get("http://localhost/ajaximg/register.php?username="+$scope.user+"&password="+$scope.pwd+"&email="+$scope.email+"&fname="+$scope.fname+"&lname="+$scope.lname).then(function(response){
            console.log(response.data);
            if(response.data!="Not registered"){
                
            }
        });
    }
})
.controller("MapsCtrl",function($scope,$rootScope,$http){
	$scope.initMap = function() {
	    $scope.map = new google.maps.Map(document.getElementById('gmaps'), {
	      center: {lat: 5, lng: 10},
	      zoom: 15,
	      enableHighAccuracy: true
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
        $http.post("http://iligtas.ph/NASASpaceApps/getLandMark.php",{latitude:position.coords.latitude,longitude:position.coords.longitude}).then(function(response){
        	$scope.landmarks = response.data.landmarks; 
        	console.log($scope.landmarks);
        	for(var i=0;i<response.data.landmarks.length;i++){
        		$scope.getDetails($scope.landmarks[i].lat,$scope.landmarks[i].lon,$scope.landmarks[i].name1);
        		//console.log($scope.landmarks[i].lat,$scope.landmarks[i].lon);
        	}
        });
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

    $scope.getDetails = function(lat,lng,name1){
    	var loc = {lat:lat,lng:lng};
    	var marker = new google.maps.Marker({
		    position: loc,
		    map: $scope.map,
		    title: name1
		});
    }

    $scope.initLocationProcedure();
})