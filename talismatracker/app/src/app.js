


var app = angular.module('talisma_tracker', ['ngRoute', 'ngResource', 'ui.bootstrap'])



app.constant('config', {
  'endpoint': 'http://172.23.128.4:3001/'
});



app.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      templateUrl : 'talisma_name.htm',
      controller  : 'talisma_tracker_Controller'
    })
});	



app.controller('talisma_tracker_Controller', function(config, $scope, $http, $modal){ 
    $http.get(config.endpoint+'talisma_tracker').then(function(result) {
    var talisma_tracker_users = result.data.talisma_tracker

    $scope.talisma_tracker_users = talisma_tracker_users

    $scope.edit = function (id) {

      for (var i in talisma_tracker_users) {
	  if(talisma_tracker_users[i].id == id){
  		var talisma_tracker_user = talisma_tracker_users[i]
		var user_arrayitem_position = i
	  }
      } 
      
      var initial_status=talisma_tracker_user.status

      var modalInstance = $modal.open({
        animation: true,
        templateUrl: 'edit.htm',
        controller: 'editTalismaTrackerController',
        resolve: {
          selectedUser: function () {
            return talisma_tracker_user
          }
        }
      })

      modalInstance.result.then(function (talisma_tracker_user) {
        $scope.talisma_tracker_users[user_arrayitem_position].name = talisma_tracker_user.name
        $scope.talisma_tracker_users[user_arrayitem_position].status = talisma_tracker_user.status
        $scope.talisma_tracker_users[user_arrayitem_position].contact = talisma_tracker_user.contact
	

        if(initial_status != talisma_tracker_user.status){
		if(talisma_tracker_user.status == "Talisma Duty"){
	 	    talisma_tracker_user.start_date = moment().format("YYYY/MM/DD HH:mm:ss")
		} else {
		    var ms = moment().diff(moment(talisma_tracker_user.start_date,"YYYY/MM/DD HH:mm:ss"));
		    var d = moment.duration(ms);
		    var partial_minutes_amount = Math.floor(d.asMinutes());
	  
		    acumulated_time = Number(talisma_tracker_user.partial_minutes_amount) + Number(partial_minutes_amount)
		    
		    minutes = Number(acumulated_time) % 1440
		    days = Math.floor((acumulated_time / 1440))
		    
		    if (days >= 1){
			talisma_tracker_user.total_days_amount = Number(talisma_tracker_user.total_days_amount) + Number(days)
			talisma_tracker_user.partial_minutes_amount = minutes
		    } else {
		        talisma_tracker_user.partial_minutes_amount = acumulated_time
		    }

	     	    talisma_tracker_user.start_date = ""
		}
        }

        $scope.talisma_tracker_users[user_arrayitem_position].start_date = talisma_tracker_user.start_date
        $scope.talisma_tracker_users[user_arrayitem_position].partial_minutes_amount = talisma_tracker_user.partial_minutes_amount
        $scope.talisma_tracker_users[user_arrayitem_position].total_days_amount = talisma_tracker_user.total_days_amount

        $http.put(config.endpoint+'talisma_tracker/'+id, talisma_tracker_user).success(function() {
          console.log("update talisma_tracker_user: " + talisma_tracker_user)
        })
      })
    }
  })
})



app.controller('editTalismaTrackerController', function($scope, $modalInstance, selectedUser) {

  $scope.talisma_tracker_user = {
    "id": selectedUser.id,
    "name": selectedUser.name,
    "status": selectedUser.status,
    "total_days_amount": selectedUser.total_days_amount,
    "contact": selectedUser.contact,
    "start_date" : selectedUser.start_date,
    "partial_minutes_amount" : selectedUser.partial_minutes_amount
  };

  $scope.save = function () {
    $scope.selectedUser
    $modalInstance.close($scope.talisma_tracker_user)
  }

  $scope.close = function () {
    $modalInstance.dismiss('cancel')
  }
});
