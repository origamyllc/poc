angular.module('thingyApp').directive('showErrors', function($compile) {
  return {
    require: 'form',
    link: function(scope, elm, attrs, formCtrl) {
      _.each($(elm).find('.form-group'), function(formgroup) {
        _.each($(formgroup).find('input, select, textarea, .btn-group label.btn, .select2-container'), function(input) {
          if ($(input).is('label.btn')){
              $(input).on('click', function () {
                $(this).trigger('show-errors-check');
              });
          }

          //if ($(input).is('select2-input') {return;}
          

          $(input).on('change blur show-errors-check', function (evt) {
            var dirty = false;
            //console.log(this);
            _.each ($(formgroup).find('input, select, textarea, .btn-group label.btn, .select2-container'), function(groupinput) {
              if (
                evt.type !== 'show-errors-check'
                &&
                ($(groupinput).is('.select2-container.ng-pristine') || $(groupinput).closest('.select2-container').length)
              ){return;}

              if ($(groupinput).hasClass('ng-invalid'))
              {
                dirty = true;
              }
              $(formgroup).toggleClass('has-error', dirty);
            });
          });
        });
      });

      scope.$on('show-errors-check', function () {
        _.each($(elm).find('input, select, textarea, .btn-group label.btn, .select2-container'), function(input) {
          $(input).trigger('show-errors-check');
        });

      });
    }
  };
});