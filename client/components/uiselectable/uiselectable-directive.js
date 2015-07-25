'use strict';

angular.module('thingyApp').directive('uiSelectable', function ($timeout) {
  return function (scope, el, attrs) {
    scope.$on("uiSelectable_regroup", function(){console.log('uiSelectable_regroup');
      var timeout = $timeout(function(){
        checkGroups();
      }, 300);
    });

    function checkGroups(){
      //check subgroups
      $('#titleslist div.panel-group > div.panel div.panel > div.panel-heading').each(function() {
        if ($(this).parent().find('div.titlesitem:not(.ui-selected)').length > 0) {
          $(this).removeClass('ui-selected');
        } else {
          $(this).addClass('ui-selected');
        }
      });

      //check groups
      $('#titleslist div.panel-group > div.panel > div.panel-heading').each(function() {
        if ($(this).parent().find('div.panel > div.panel-heading:not(.ui-selected)').length > 0) {
          $(this).removeClass('ui-selected');
        } else {
          $(this).addClass('ui-selected');
        }
      });
    }

    el.selectableScroll({
      filter: '.titlesitem, .panel-heading',
      cancel: '.glyphicon-trash, strong, .panel-title a',
      
      unselected: function( event, ui ) {
        if ($(ui.unselected).hasClass('panel-heading')) {
          $(ui.unselected).parent().find('div.ui-selected').removeClass('ui-selected');
        }
      },

      selected: function( event, ui ) {
        if ($(ui.selected).hasClass('panel-heading')) {
          $(ui.selected).parent().find('div.ui-selectee:not(.ui-selected)').addClass('ui-selected');
        }
      },

      stop: function( event, ui ) {
        
        checkGroups();

        //console.time('st');
        scope.contractData.selectedTitleIds = $.map($('#titleslist div.titlesitem.ui-selected'), function(el) {return $(el).data('id');});
        
        //console.timeEnd('st');
        
        scope.$apply();
      }
    });
  };
});