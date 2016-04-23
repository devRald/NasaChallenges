var app = angular.module("myApp",["ngRoute"]);

app.config(function($routeProvider,$locationProvider){
	$routeProvider
	.when("/", {
		templateUrl: "templates/home.html"
	})
	.when("/maps",{
		templateUrl: "templates/maps.html"
	})
});