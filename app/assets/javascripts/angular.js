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

  // Sin Types for Select in HTML
  this.SIN_TYPES = [ 'Gluttony', 'Greed', 'Anger', 'Pride', 'Lust', 'Sloth', 'Envy' ];
  this.newTransgressionSinType = 'Gluttony';

  //this fetches transgression data and adds it to controller
  var getTransgressions = function(){
    // get transgressions for current User
    $http.get('/transgressions').success(function(data){
      //just add the transgressions to the controller, data comes back with sinner as well
      controller.current_user_transgressions = data.transgressions;
    });
  }
  //fetch transgression data for current user as TransgressionsController initializes
  getTransgressions();

  // create a transgression
  this.createTransgression = function(){

    //as soon as function is called,
    //get transgression data (from form)
    //and push it onto controller's current_user_transgressions property
    //this way the data is there immeditely, while we wait for the ajax calls to return
    controller.current_user_transgressions.push({
      sin_type: this.newTransgressionSinType + "...loading",
      description: this.newTransgressionDescription + "...loading"
    });

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
      //once response to create transgression comes back, 
      //pop off what was pushed at beginning of this.createTransgression
      //push the response's data on...
      controller.current_user_transgressions.pop();
      controller.current_user_transgressions.push(data.transgression);
      //...and begin refreshing transgression data
      getTransgressions();
    });
  }

  this.createConfession = function(transgression_id){
    $http.post('/transgressions/'+transgression_id+'/confessions', {
      //include authenticity_token
      authenticity_token: authenticity_token,
      confession: {
        description: this.newConfessionDescription,
        occurred_at: this.newConfessionDate
      }
    }).success(function(data){
      console.log(data)
    });
  }
}]);
