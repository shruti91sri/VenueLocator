var myApp = angular.module('venueLocator');

myApp.service('geoLocatorService' ,['$http','$q',function($http,$q){
	 
	var self = this;
    self.getVenueDetails= function(pos,rad) {
      var deferred = $q.defer();	      
      var URL = "https://api.foursquare.com/v2/venues/explore";
      var param ={
      client_id: "PMHC2WA1VCBHVYOPPSJ0QSBYTLRF4PNJ04OWVWV0PZJ0QFIR",
      client_secret: "CULSZZ44YAEBOWBFGPB4BF5ISRXXSNYR0EE3JV3CNE2ZWHV0",
      v: "20182507",
      ll : pos.lat+","+pos.lng,
      radius : rad,      
      };

	  $http({
	  method: 'GET',
	  url: URL,
	  params: param,
      }).then(function (response) {
          deferred.resolve(response.data.response.groups[0].items);
        }, function (err) {
          deferred.reject(err);
        });
      return deferred.promise
      
    } 
	
}]);
