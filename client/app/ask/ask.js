angular.module('boorish.ask', [])

///////////////////////////////////////////////////////////////////////////////////////////////
///// Ask Controller: Pulls tags and courses from the database to display to the user. User
/////   writes question, and selects tag and course.
///// 
///// addQuestion: uses the addQuestion facotry to add question to the database
///////////////////////////////////////////////////////////////////////////////////////////////

.controller('askController', function($scope, $window, $location, Tags, Courses, Questions, Auth, Links) {
  $scope.question = {};
  $scope.Email = JSON.parse($window.localStorage.getItem("email"))
  $scope.savedLinks = [{url: "url", email: "lol"}];
  $scope.getSaved = function(){
    Links.getLinks($scope.Email).then(function(data){
      $scope.savedLinks = data;
    })
  }
  $scope.userLinks = [];
  $scope.getSaved2 = function(){
    Links.getLinks($scope.userSearch).then(function(data){
      $scope.userLinks = data;
    })
  }

  $scope.getSaved();
  //$scope.getSaved2();
  //$scope.deleteLink = function(linkId){
  //  Links.deleteLink(linkId).then(function(){
  //    $scope.getSaved();
  //  })
  //}
  //TODO(me): link autofill to right data
  $scope.autofill= function(index){
    $scope.question.title = $scope.savedLinks[index].title
    $scope.question.tag = $scope.savedLinks[index].tag
    $scope.question.link = $scope.savedLinks[index].url
    $scope.question.text = $scope.savedLinks[index].text
    $scope.savedLinks.splice(index, 1);
    // $scope.deleteLink($scope.savedLinks[index].link_id)
  }

  $scope.autofill2= function(index){
    $scope.question.title = $scope.userLinks[index].title
    $scope.question.tag = $scope.userLinks[index].tag
    $scope.question.link = $scope.userLinks[index].url
    $scope.question.text = $scope.userLinks[index].text
    $scope.userLinks.splice(index, 1);
    // $scope.deleteLink($scope.savedLinks[index].link_id)
  }

  if (!Auth.isAuth()) {
    $location.path('/signin');
  } else {

    Tags.getTags()
    .then(function(data) {
      $scope.tagOptions = {
        availableOptions: data.results,
        selectedOption: data.results[data.results.length - 1]
      };
      return;
    });
    // .then(function() {
    //   return Courses.getCourses();
    // })
    // .then(function(data) {
    //   $scope.courseOptions = {
    //     availableOptions: data.results,
    //     selectedOption: data.results[data.results.length - 1]
    //   };
    // });
    var embedly = {};
    //call url link

    $scope.addQuestion = function() {
      $scope.question.id_user = $window.localStorage.getItem('com.boorish');  // pulls userId from localStorage

      $scope.question.tag = $scope.question.tag || $scope.tagOptions.selectedOption.name;  // pulls selected tag
      
      Questions.embedLink($scope.question.link).then(function(data) {
        embedly = data.data;
        
        $scope.question.provider_url = embedly.provider_url || null;
        $scope.question.thumbnail_width = embedly.thumbnail_width || null;
        $scope.question.thumbnail_height = embedly.thumbnail_height || null;
        $scope.question.thumbnail_url = embedly.thumbnail_url || null;
        $scope.question.provider_url = embedly.provider_url || null;
        $scope.question.sitetitle = embedly.title || null;
        $scope.question.provider_name = embedly.provider_name || null;
        $scope.question.version = embedly.version || null;
        $scope.question.type = embedly.type || null;

      }).then(function(){
        Questions.addProduct($scope.question).then(function() { // adds new Question with addQuestion factory method
          $location.path('/questions'); // redirects to all questions
        });

      }).catch(function(err){
        alert(err);
      });

      // Questions.addProduct($scope.question).then(function() { // adds new Question with addQuestion factory method
      //   $location.path('/questions'); // redirects to all questions
      // });

    };



    // var embedder = function(){
    //   Questions.embedLink($scope.question.url).then(function(data){
    //     $scope.question.embedData = data.data;
    //   });
    // }

  }


})