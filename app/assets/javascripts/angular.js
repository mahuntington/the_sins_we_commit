var app = angular.module('SinsApp', []);

//Header Controller
app.controller('HeaderController', ['$http', function($http){
  var controller = this;
  //Get current user fromroute
  $http.get('/session').success(function(data){
    //setting current user to data.current user because
    //data comes back like {current_user:{email:'asdf.asdf'}}
    controller.current_user = data.current_user;
  })
}]);

//Transgressions Controller
app.controller('TransgressionsController', ['$http', function($http){
  //get authenticity_token from DOM (rails injects it on load)
  var authenticity_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
  var controller = this;

  var getTransgressions = function(){
    // get transgressions for current User
    $http.get('/transgressions').success(function(data){
      //just add the transgressions to the controller, data comes back with sinner as well
      controller.current_user_transgressions = data.transgressions;
    });
  }
  getTransgressions();

  // create a transgression
  this.createTransgression = function(){
    //make a post to /transgressions
    $http.post('/transgressions', {
      //include authenticity_token
      authenticity_token: authenticity_token,
      //values from form
      transgression: {
        sin_type: this.newTransgressionSinType,
        description: this.newTransgressionDescription
      }
    }).success(function(data){
        getTransgressions();
    });
  }
}]);
