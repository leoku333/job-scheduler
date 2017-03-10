/*global GRID_TEMPLATE */
angular.module('weeklyScheduler')
  .directive('dailyGrid', ['weeklySchedulerTimeService', function (timeService) {

    function doGrid(element, attrs, model) {
      var i;
      // Calculate week width distribution
      var tickcount = model.nbDays;
      var ticksize = 100 / tickcount;
      var gridItemEl = GRID_TEMPLATE.css({width: ticksize + '%'});
      var now = model.minDate.clone();

      // Clean element
      element.empty();

      for (i = 0; i < tickcount; i++) {
        var child = gridItemEl.clone();
        if (angular.isUndefined(attrs.noText)) {
          child.text(now.add(i && 1, 'day').date());
        }
        element.append(child);
      }
    }

    return {
      restrict: 'E',
      require: '^weeklyScheduler',
      link: function (scope, element, attrs, schedulerCtrl) {
        if (schedulerCtrl.config) {
          doGrid(element, attrs, schedulerCtrl.config);
        }
        schedulerCtrl.$modelChangeListeners.push(function (newModel) {
          doGrid(element, attrs, newModel);
        });
      }
    };
  }]);
