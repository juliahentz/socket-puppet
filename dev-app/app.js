angular.module('socketPuppetApp', ['ui.bootstrap','ui.router','ngAnimate', 'btford.socket-io']);

angular.module('socketPuppetApp').config(function($stateProvider, $urlRouterProvider) {

    $stateProvider.state('scene', {
        url: '/scene',
        templateUrl: 'partial/scene/scene.html',
        controller: 'SceneCtrl'
    });
    /* Add New States Above */
    $urlRouterProvider.otherwise('/scene');

})
    .factory('mySocket', function (socketFactory) {
        var socket = io.connect();
        
        socket.on('connect', function() {
            socket.emit('message', 'angular-socket is set up');
            socket.on('message', function(data){
                console.log(data);
            });
        });
            
        return socketFactory();
    });

angular.module('socketPuppetApp').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
