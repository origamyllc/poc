'use strict';

angular.module('thingyApp').directive('disabler', function($compile, $q) {
  return {
    priority: 1,
    terminal: true,
    controller: function ($scope) {
      this.success = function (elm, originalClasses) {
        setTimeout(function(){
          elm.button('reset');
          elm.attr('class', originalClasses);
        }, 250);//add a slight delay
      };

      this.error = function (elm) {
        elm.button('reset');
        elm.addClass('btn-failure');//may need to keep track of if it had success and add the style back
      };

      this.process = function(elm, clickAction, originalClasses){
        var self = this;
        var result = $scope.$eval(clickAction);
        if (result === false || typeof result === 'undefined')
        {
          this.error(elm);
        }
        else
        {
          $q.when(result).then(
            function(){//also handles trues.
              self.success(elm, originalClasses);
            },
            function(){
              self.error(elm);
            }
          );
        }
      };
    },
    link: function(scope, elm, attrs, controller) {
      var clickAction = attrs.ngClick;
      var classes = elm.attr('class');

      elm.bind('click',function () {
        scope.$broadcast('resetDisablers');
        elm.removeClass('btn-failure');
        
        //start
        elm.data('loading-text', attrs.disabler);
        elm.button('loading');

        if (attrs.hasOwnProperty('confirmtext'))
        {
          
          setTimeout(function(){
            if ( ! window.confirm(attrs.confirmtext)) {
              controller.success(elm, classes);
            } else {
              controller.process(elm, clickAction, classes);
            }
          }, 50);
          
        } else {
          controller.process(elm, clickAction, classes);
        }
   
      });

      elm.bind('mousedown', function () {
        elm.addClass('active');
      });

      elm.bind('mouseup', function () {
        elm.removeClass('active');
      });

      scope.$on('resetDisablers', function () {
        elm.removeClass('btn-failure');
      });
    }
  };
});