var app = angular.module('SinsApp', []);

app.controller('HeaderController', ['$http', function($http){
  var controller = this;
  $http.get('/session').success(function(data){
    controller.current_user = data.current_user;
  });
}]);

app.controller('TransgressionsController', ['$http', function($http){
  var controller = this;
  $http.get('/transgressions').success(function(data){
    controller.transgressions = data.transgressions;
  });

  this.createTransgression = function(){
    var csrf = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    $http.post('/transgressions', {
      authenticity_token: csrf,
      transgression: {
        sin_type: controller.newTransgressionSinType,
        description: controller.newTransgressionDescription
      }
    }).success(function(data){
      $http.get('/transgressions').success(function(data){
        controller.transgressions = data.transgressions;
      });
    });
  }
}]);
