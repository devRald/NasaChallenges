app.controller("MainCtrl",function($scope,$rootScope){
    // Load the SDK asynchronously
    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));	
	
    $scope.openNav = function(){
		$('.button-collapse').sideNav({
		    menuWidth: 300, // Default is 240
		    edge: 'left', // Choose the horizontal origin
		    closeOnClick: true // Closes side-nav on <a> clicks, useful for Angular/Meteor
		  }
		);
	}

    function statusChangeCallback(response) {
        if (response.status === 'connected') {
          // Logged into your app and Facebook.
          // called when page refresh
          testAPI();
        } else if (response.status === 'not_authorized') {
          // The person is logged into Facebook, but not your app.
          document.getElementById('status').innerHTML = 'Please log ' +
            'into this app.';
        } else {
          // The person is not logged into Facebook, so we're not sure if
          // they are logged into this app or not.
          document.getElementById('status').innerHTML = 'Please log ' +
            'into Facebook.';
        }
      }

      function checkLoginState() {
        FB.getLoginStatus(function(response) {
          FB.api(
              "/{user-id}/picture",
              function (response) {
                if (response && !response.error) {
                  /* handle the result */
                }
              }
          );
          statusChangeCallback(response);
        });
      }

      window.fbAsyncInit = function() {
      FB.init({
        appId      : '1013743195374338',
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.6', // use graph api version 2.5
        cookie     : true
      });

      FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
      });

      };

      //first login
      function testAPI() {
        console.log('Welcome!  Fetching your information.... ');
        FB.api('/me',{fields: ['name','picture']}, function(response) {
          console.log(response);
          /*if(sessionStorage.getItem("userdata")===null){
              $http.post("http://"+host+"/ELECTIONPH/__getUserdata.php",{mydata:response}).then(function(res){
                console.log(res.data);
                sessionStorage.setItem("userdata",JSON.stringify(res.data));
                $rootScope.setLogin(false);
              });
          }*/
          console.log('Successful login for: ' + response.name);
          document.getElementById('status').innerHTML =
            'Thanks for logging in, ' + response.name + '!';
        });
      }

    $scope.login_fb = function(){
        FB.login(function(response) {
          if (response.authResponse) {
           //this will call testAPI
           console.log('Welcome!  Fetching your information.... ');
           FB.api('/me',{fields: ['name','picture']}, function(response) {
             console.log('Good to see you, ' + response.name + '.');
                /*$http.post("http://"+host+"/ELECTIONPH/__checkUser.php",{mydata:response}).then(function(res){
                    if(res.data=="done"){
                        $http.post("http://"+host+"/ELECTIONPH/__getUserdata.php",{mydata:response}).then(function(res){
                            console.log(res.data);
                            sessionStorage.setItem("userdata",JSON.stringify(res.data));
                            $rootScope.setLogin(false);
                          });
                    }
                });*/
           });
          } else {
           console.log('User cancelled login or did not fully authorize.');
          }
      });
    }
})
.controller("MediaCtrl",function($scope,$rootScope,$http){
    $('.carousel').carousel({dist:0});
})
.controller("LoginCtrl",function($scope,$rootScope,$http,$location){
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    /*$scope.userLogin = function(){
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
    }*/
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