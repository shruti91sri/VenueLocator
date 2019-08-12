 angular
.module('venueLocator')
.controller('GeoLocatorController',['$scope','$window','geoLocatorService' , function($scope,$window,geoLocatorService){
 	
 	//declare js variables
 	var map,infoWindow, markers=[];
 	$scope.pos; 
  $scope.btnDisabled =true; 
 	$scope.radiusList=[
 	{radius:"1000"},
 	{radius:"2000"},
 	{radius:"3000"},
 	{radius:"4000"},
 	{radius:"5000"},
 	{radius:"6000"},
 	{radius:"7000"},
 	{radius:"8000"},
 	{radius:"9000"},
 	{radius:"9999"},
 	];
  //This func is called from ng-init from index.html	
 	$scope.renderMap = function(){
    $scope.btnDisabled =true;
 		$scope.radius = "2000";
 		window.initMap = initMap;
 		loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyC8c44UjAHrIL5NKV6BD_LB87tw-4QtOpI&callback=initMap");
 		 
 	}
 	//Function to create custom script tag and append it in the Html
 	function loadScript(url){
    	var index = window.document.getElementsByTagName('script')[0];
    	//create your own script tag
    	var script = window.document.createElement("script");
    	//add url to the script tag created above
    	script.src=url;
    	script.async = true;
    	script.defer = true;
    	//append the script tag in the HTML
    	index.parentNode.insertBefore(script,index);
    }
  //Function to initialize map.This is a callback function from the script tag created from loadScript function
    function initMap(){
    	//get Current Location of the user
   		getCurrentLocation();   		      
    }

    //function to get current location of the user
    function getCurrentLocation(){
    	//Using HTML5 geolocation.
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
          $scope.pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          $scope.btnDisabled =false;
          //Once current location is determined ,set them on the MAP		               
          setLocationOnMap();        	
        }, function(error) {//Error Handling
          handleLocationError(true, error.message);
        });       
      } else {
        // Browser doesn't support Geolocation
        handleLocationError(false,"Error: Your browser doesn\'t support geolocation.");
      }
    }
    //Function to handle errors
    function handleLocationError (browserHasGeolocation, error) {
      $scope.btnDisabled =true;
    //set some default location on the map
    map = new window.google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 6
        });
    infoWindow = new window.google.maps.InfoWindow; 
    //if current location is not available then set the default location and set the error message        
    infoWindow.setPosition(map.getCenter());        
    infoWindow.setContent(browserHasGeolocation ?
                          'Error: The Geolocation service failed.'+error : error);        
    infoWindow.open(map);
    } 

    //function to set the location on the map
    function setLocationOnMap(){    	
    	getVenue();
    	map = new window.google.maps.Map(document.getElementById('map'), {
		    center: {lat: $scope.pos.lat, lng: $scope.pos.lng},
		    zoom: 12
		    });
    	infoWindow = new window.google.maps.InfoWindow; 
        infoWindow.setPosition($scope.pos);
        infoWindow.setContent('Current');
        infoWindow.open(map);
        map.setCenter($scope.pos);        
    }  

    //function to get venue details from foursquare api
    function getVenue(){ 
    	geoLocatorService.getVenueDetails($scope.pos,$scope.radius).then(function (response) {
          $scope.venueList= response;                 
          //call markers function to create markers on map          
          createMarkers($scope.venueList,map);          
        });    	
    }

    //Function to create markers on the map as per the radius. Default radius is 2000ms
    function createMarkers(myVenue,map){
    	for (var i=0;i<myVenue.length;i++){    		
	      var marker = new window.google.maps.Marker({
	        position: {lat: myVenue[i].venue.location.lat , lng: myVenue[i].venue.location.lng},
	        map: map,
	        title: myVenue[i].venue.name
	      });
        //Push all the markers as per radius
	      markers.push(marker);
    	}	      
    }    
   	
  //Delete existing Markers
   function clearMarkers(map){  	
    	for (var i = 0; i < markers.length; i++) {
  	    markers[i].setMap(map);
  	  }  
  	   markers = [];    
    } 

//Function to update the location as per radius selected by the user
  $scope.updateRadius = function(rad){  	
  	if(rad && $scope.radius!=rad){      
  		$scope.radius = rad; 
      //Clear the Existing Markers on the Map then add the new markers
  		clearMarkers(null);
  		getVenue();
  	}
  }
 
}]);


