function Stash($scope, $http) {
    $http.get('http://localhost:8080/display').
        success(function(data) {
            $scope.stashes = data;
        });
}