angular.module('boorish.questions', [])

.controller('questionsController', function($scope, $location, Questions, Auth) {
  $scope.questions = [];

  $scope.init = function() {
    
    Auth.setUser();
    var user = Auth.isAuth();

    if (!user) {
      console.log('There is no token. redirecting to sign-in');
      $location.path('/signin');
    } else {
      Questions.getAllQuestions().then(function(data) {
        $scope.questions = data.results.map(function(question) {
          question.title = question.text.slice(0,60);
          return question;
        });
      });
    }
  };

  $scope.init();
});