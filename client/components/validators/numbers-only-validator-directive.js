angular.module('thingyApp').directive('numbersOnly', function(){
          

   return  {
        restrict: 'A',
        link: function (scope, elm, attrs, ctrl) {
            elm.on('keypress', function (event) {
                if ([9,8, 13, 27, 39].indexOf(event.which) > -1) {
                    // backspace, enter, escape, arrows
                    return true;
                } else if (event.which >= 48 && event.which <= 57) {
                    // numbers
                    return true;
                } 
                else {

                    event.preventDefault();
                    return false;
                }
            });
        }
    };
});