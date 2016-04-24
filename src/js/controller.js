app.controller("MainCtrl",function($scope,$rootScope,$http,$location){
    // Load the SDK asynchronously
    var host = "192.168.0.219";
    var url = "http://"+host+"/ajaximg/";

    (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));   

    $scope.logout = function(){
        console.log("logout");
          FB.logout(function(response) {
            // user is now logged out
            console.log(response);
            sessionStorage.removeItem("userdata");
          });

          $location.path("/");  
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
        FB.api('/me',{fields: ['name','picture','email','first_name','last_name','age_range','gender']}, function(response) {
          console.log(response);
          if(sessionStorage.getItem("userdata")===null){
              $http.post(url + "getDetails.php",{mydata:response}).then(function(res){
                    console.log(res.data);
                    console.log("getting details");
                    sessionStorage.setItem("userdata",JSON.stringify(res.data));
                    $location.path("/home");
                }) 
          }
          /*if(sessionStorage.getItem("userdata")===null){
              $http.post("http://"+host+"/ELECTIONPH/__getUserdata.php",{mydata:response}).then(function(res){
                console.log(res.data);
                sessionStorage.setItem("userdata",JSON.stringify(res.data));
                $rootScope.setLogin(false);
              });
          }*/
          console.log('Successful login for: ' + response.name);
        });
      }

    $scope.login_fb = function(){
        FB.login(function(response) {
          if (response.authResponse) {
           //this will call testAPI
           console.log('Welcome!  Fetching your information.... ');
           FB.api('/me',{fields: ['name','picture','email','first_name','last_name','age_range','gender']}, function(response) {
             console.log('Good to see you, ' + response.name + '.');
             $http.post(url + "fb.php",{mydata:response}).then(function(res){
                console.log(res.data);
                console.log("logging in");
                sessionStorage.setItem("userdata",JSON.stringify(res.data));
                $location.path("/home");
                //sessionStorage.setItem("userdata",JSON.stringify(res.data));
            })
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
.controller("HomeCtrl",function($scope,$rootScope,$http){
    var host = "192.168.0.219";
    var url = "http://"+host+"/ajaximg/";

    $('.button-collapse').sideNav();
    $rootScope.userdata = JSON.parse(sessionStorage.getItem("userdata"));

    console.log($rootScope.userdata.name);
    $('.tooltipped').tooltip({delay: 50});
    $('.modal-trigger').leanModal();
    $('ul.tabs').tabs();    
    //
    $scope.turnTo = function(){
        $('ul.tabs').tabs('select_tab', 'test1');
    }
    $scope.displayAndWatch = function(position) {
        // set current position
        $http.post("http://192.168.0.219/ajaximg/getMarkers.php?lat="+position.coords.latitude+"&lng="+position.coords.longitude+"&radius=0.310686").then(function(response){
            $scope.aviators = response.data;
            for(var i=0;i<response.data.length;i++){
                $scope.getDetails($scope.aviators[i].lat,$scope.aviators[i].lng,$scope.aviators[i].aviator,$scope.aviators[i].location);
                //console.log($scope.landmarks[i].lat,$scope.landmarks[i].lon);
            }
        });
        $scope.setCurrentPosition(position);
        // watch position
        $scope.watchCurrentPosition();
    }

    $scope.initMap = function() {
        $scope.styles = [
          {
            stylers: [
              { hue: "#00ffe6" },
              { saturation: -20 }
            ]
          },{
            featureType: "road",
            elementType: "geometry",
            stylers: [
              { lightness: 100 },
              { visibility: "simplified" }
            ]
          },{
            featureType: "road",
            elementType: "labels",
            stylers: [
              { visibility: "off" }
            ]
          }
        ];

        $scope.map = new google.maps.Map(document.getElementById('gmaps'), {
          center: {lat: 5, lng: 10},
          zoom: 17,
          enableHighAccuracy: true,
          draggable:true
        });

        $scope.map.setOptions({styles: $scope.styles});
    }

    $scope.initLocationProcedure = function(){
        $scope.initMap();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($scope.displayAndWatch);
        } else {
            alert("Your browser does not support the Geolocation API");
        }
    }

    $scope.setMarkerPosition = function(marker, position) {
        marker.setPosition(
            new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude)
        );
        console.log("update");
        $scope.circle.bindTo('center', marker, 'position');
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
        var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/man.png';
        $scope.currentPositionMarker = new google.maps.Marker({
            map: $scope.map,
            position: new google.maps.LatLng(
                pos.coords.latitude,
                pos.coords.longitude
            ),
            title: "Current Position",
            icon:iconBase
        });
        $scope.map.panTo(new google.maps.LatLng(
            pos.coords.latitude,
            pos.coords.longitude
        ));

        $scope.circle = new google.maps.Circle({
          map: $scope.map,
          radius: 500,    // 10 miles in metres
          fillColor: '#AA0000'
        });
        $scope.circle.bindTo('center', $scope.currentPositionMarker, 'position');
    }

    $scope.openModal = function(a,loc,desc){
        $('#modal1').openModal();
        document.getElementById('title').innerHTML = a;
        document.getElementById('info').innerHTML = loc;
        document.getElementById('desc').innerHTML = desc;
    }

        $scope.getDetails = function(lat,lng,aviator,loc){
        $scope.loc = new google.maps.LatLng(
            lat,lng
        )
        $scope.marker = new google.maps.Marker({
            position: $scope.loc,
            map: $scope.map,
            title: aviator
        });

        $http.get(url+"getMore.php?title="+aviator).then(function(response){
            $scope.desc = response.data;
            console.log(response.data.query);
        });

        $scope.marker.addListener('click', function() {
            $scope.openModal(aviator,loc);
        });
        console.log(lat,lng,aviator);
    }

    $scope.initLocationProcedure();
})
.controller("LoginCtrl",function($scope,$rootScope,$http,$location){
    $('.collapsible').collapsible({
      accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });

    var host = "192.168.0.219";
    var url = "http://"+host+"/ajaximg/";
    
    

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
        console.log()
        $scope.circle = new google.maps.Circle({
          map: $scope.map,
          radius: 150,    // 10 miles in metres
          fillColor: '#AA0000'
        });
        circle.bindTo('center', $scope.currentPositionMarker, 'position');

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