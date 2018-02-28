var moviesApp = angular.module('moviesApp', ['ngRoute']);

moviesApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
    .when('/movies', {
        templateUrl : '/static/app/html/partial/movies.html'
    })
    .when('/addMovie/:id', {
        templateUrl : '/static/app/html/partial/addMovie.html'
    })
    .otherwise({
        redirectTo: '/'
    });
}]);

moviesApp.controller('moviesController', function($scope, $http, $location){
	var paramsConfig = {};
	$scope.currentPage = 0;
	$scope.totalPages = 0;

	$scope.configureParameters = function(){
		paramsConfig = { params:{} };
		if($scope.currentPage)
			paramsConfig.params.page = $scope.currentPage;

		$scope.load();
	}

	$scope.filterParameters = function(){
		paramsConfig = { params:{} };
		if($scope.currentPage)
			paramsConfig.params.page = $scope.currentPage;
		if($scope.filterTitle)
			paramsConfig.params.filterTitle = $scope.filterTitle;
		if($scope.filterYear)
			paramsConfig.params.filterYear = Number($scope.filterYear);
		if($scope.filterRating)
			paramsConfig.params.filterRating = Number($scope.filterRating);
		if($scope.filterGenre)
			paramsConfig.params.filterGenre = Number($scope.filterGenre);
		
		$scope.filter();
	}

	$scope.changePage = function(i){
		if(($scope.currentPage > 0 && i < 0) || (i > 0 && $scope.currentPage < $scope.totalPages)){
			$scope.currentPage += i;
			$scope.configureParameters();
		}
	}

	$scope.load = function(){
		$http.get('/api/movies', paramsConfig).then(function(response){
			console.log('(Load Movies) Success: ', response.status, response.statusText);
			$scope.movies = response.data;
			$scope.totalPages = response.headers('totalPages');
		}, function(response){
			console.log('(Load Movies) Error: ', response.status, response.statusText);
		});
	}

	$scope.filter = function(){
		$http.get('/api/movies/filterMovies', paramsConfig).then(function(response){
			console.log('(Filter Movies) Success: ', response.status, response.statusText);
			$scope.movies = response.data;
		}, function(response){
			console.log('(Filter Movies) Error: ', response.status, response.statusText);
		});
	}

	$scope.load();

	$scope.save = function(){
		$http.post('/api/movies/', $scope.movie).then(function(response){
			console.log('(Add Movie) Success:', response.status, response.statusText);
			$scope.currentPage = 0;
			$scope.configureParameters();
			resetInputValues();
		}, function(response){
			console.log('(Add Movie) Error:', response.status, response.statusText);
		});
	}

	$scope.delete = function(id){
		$http.delete('/api/movies/' + id).then(function(response){
			console.log('(Delete Movie) Success:', response.status, response.statusText);
			$scope.load();
		}, function(response){
			console.log('(Delete Movie) Error:', response.status, response.statusText);
		});
	}

	$scope.printData = function(){
		console.log($scope.filterTitle + ' ' + $scope.filterYear + ' ' + $scope.filterRating + ' ' + $scope.filterGenre);
	}

	$scope.goToAddMovieHTML = function(id){
		$location.path('/addMovie/' + id);
	}

	$scope.setMovieValues = function(movie){
		$scope.movie = angular.copy(movie);
	}

	var resetInputValues = function(){
		$scope.movie = {};
	}

	var loadGenres = function(){
		$http.get('/api/genres').then(function(response){
			console.log('(Load Genres) Success:', response.status, response.statusText);
			$scope.genres = response.data;
		}, function(response){
			console.log('(Load Genres) Error:', response.status, response.statusText);
		});
	}

	loadGenres();
});

moviesApp.controller('addMovieController', function($scope, $http, $location, $routeParams){
	$scope.loadMovie = function(){
		$http.get('/api/movies/' + $routeParams.id).then(function(response){
			console.log('(Get Movie) Success', response.status, response.statusText);
			$scope.movie = response.data;
		}, function(response){
			console.log('(Get Movie) Error', response.status, response.statusText);
		});
	}

	$scope.loadMovie();

	$scope.save = function(){
		$http.post('/api/movies/', $scope.movie).then(function(response){
			console.log('(Add Movie) Success:', response.status, response.statusText);
			$location.url('/movies');
		}, function(response){
			console.log('(Add Movie) Error:', response.status, response.statusText);
		});
	}

	var loadGenres = function(){
		$http.get('/api/genres').then(function(response){
			console.log('(Load Genres) Success:', response.status, response.statusText);
			$scope.genres = response.data;
		}, function(response){
			console.log('(Load Genres) Error:', response.status, response.statusText);
		});
	}

	loadGenres();
});

wafepaApp.controller('nekretnineCtrl', function($scope, $http, $routeParams, $location){
	$scope.currentPage=0;
    $scope.totalPages;
    $scope.changePage = function (i) {
    	 var config = {params:{}}
        if(($scope.currentPage>0&&i<0)||(i>0&&$scope.currentPage<$scope.totalPages)){
            $scope.currentPage += i;
            $scope.ucitajNekretnine();
        }
    }
  
 
   $scope.filter = function () {
	   if($scope.currentPage){
           config.params.page = $scope.currentPage;
       }
	   if($scope.adresa){
           config.params.adresa = $scope.adresa;
       }
      if($scope.cenaOd){
          config.params.cenaOd =  Number($scope.cenaOd);
      }
      if($scope.cenaDo){
          config.params.cenaDo = Number($scope.cenaDo);
      }
       $scope.ucitajNekretnine();
   }
   
   $scope.save = function(){
       if($scope.nekretnina.id){
           $http.put('/api/nekretnine/'+$scope.nekretnina.id,$scope.nekretnina).then(function () {
               $scope.ucitajNekretnine();
               $scope.ucitajTipNekretnine();
           });        
       }else{
           $http.post('/api/nekretnine/',$scope.nekretnina).then(function () {
               $scope.ucitajNekretnine();
           });
       }
   }

   $scope.prepTip = function(tip){
       return tip.naziv;
   }

   var ucitajTipNekretnine = function () {
       $http.get('/api/tipNekretnine')
           .then(function (resp) {
               $scope.tipNekretnine = resp.data;
           });
   }

   $scope.ucitajNekretnine = function(){    
	   var config = {params:{}}
      if($scope.currentPage){
          config.params.page=$scope.currentPage;            
      }
       var activitiesPromise = $http
                   .get('/api/nekretnine',config);
       activitiesPromise.then(function (resp, status) {
           //console.log(resp.data);
           $scope.nekretnine = resp.data;
           $scope.totalPages = Number(resp.headers().totalpages);
        
       },function (resp, status){            
           console.log('error');
           console.log(status);
       });
   }


   ucitajTipNekretnine();
   $scope.ucitajNekretnine();

   $scope.setForUpdate = function (nekretnina) {
       $scope.nekretnina = angular.copy(nekretnina);
   } 
   
   $scope.delete = function (id) {
       console.log('delete/'+id);
       $http.delete('/api/nekretnine/'+id).then(function () {
       	  $scope.ucitajNekretnine();
       });
   }
   
   
  
   $scope.gotoNekretnina = function (id) {
       $location.path('nekretnina/'+id);
   }

});


wafepaApp.controller('nekretninaCtrl', function($scope, $http, $routeParams, $location){
	 console.log($routeParams.id);
	 
	  $scope.prepTip = function(tip){
	       return tip.naziv;
	   }

	  var ucitajTipNekretnine = function () {
	       $http.get('/api/tipNekretnine')
	           .then(function (resp) {
	               $scope.tipNekretnine = resp.data;
	           });
	   }
	  
	    var ucitajNekretnine = function(){
	        var activitiesPromise = $http.get('/api/nekretnine/'+$routeParams.id);
	        activitiesPromise.then(function (resp, status) {
	            //console.log(resp.data);
	            $scope.nekretnina = resp.data;
	        },function (resp, status){            
	            console.log('error');
	            console.log(status);
	        });
	    }
	    
	    ucitajTipNekretnine();
	    ucitajNekretnine();

	    $scope.save = function(){
	        $http.put('/api/nekretnine/'+$scope.nekretnina.id,$scope.nekretnina).then(function () {
	            $location.path('nekretnine');
	        });        
	    }

	});