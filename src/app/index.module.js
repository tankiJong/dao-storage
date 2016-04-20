import { Model } from './model';


angular.module('myApp',[])
  .directive('foo', function(fakeService){
      return {
          template: '<input type="text" ng-model="model.data"></input>',
          link: function(scope){
              scope.model = fakeService.fetch();
          },
      }
  })
  .directive('fuz', function(fakeService){
      return {
          template: '<div>{{ model.data }}</div>',
          link: function(scope){
              scope.model = fakeService.fetch();
          },
      }
  })
  .service('fakeService', function(){
      var fakeData = {
          numData: 111,
          objData: {
              foo:1,
              fuz:2,
          }
      }
            
      this.fetch = function(){
          return new Model(fakeData);
      }
  })