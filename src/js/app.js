var app = angular.module("myApp",["ngRoute","GMaps"]);

app.run(function($rootScope,$location){
	console.log("App has started");
	if(sessionStorage.getItem("userdata")!=null){
		$location.path("/home");
	}
	else{
		$location.path("/");
		console.log("Please Login.");
	}
});

app.config(function($routeProvider,$locationProvider){
	$routeProvider
	.when("/", {
		templateUrl: "templates/login.html",
		controller: "LoginCtrl"
	})
	.when("/home",{
		templateUrl: "templates/home.html",
		controller: 'HomeCtrl'
	})
	.when("/maps",{
		templateUrl: "templates/maps.html",
		controller: "MapsCtrl"
	})
	.when("/media",{
		templateUrl:"templates/media.html",
		controller: "MediaCtrl"
	})
});