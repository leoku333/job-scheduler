angular.module('weeklyScheduler')

  .filter('byIndex', [function () {
    return function (input, index) {
      var ret = [];
      angular.forEach(input, function (el) {
        if (el.index === index) {
          ret.push(el);
        }
      });
      return ret;
    };
  }])

  .directive('multiSlider', ['weeklySchedulerTimeService', function (timeService) {
    return {
      restrict: 'E',
      require: '^weeklyScheduler',
      templateUrl: 'ng-weekly-scheduler/views/multi-slider.html',
      link: function (scope, element, attrs, schedulerCtrl) {
        var conf = schedulerCtrl.config;

        // The default scheduler block size when adding a new item
        var defaultNewScheduleSize = parseInt(attrs.size) || 8;
        console.log(defaultNewScheduleSize);
        console.log(schedulerCtrl);

        var valToPixel = function (val) {
          var percent = val / (conf.nbDays);
          return Math.floor(percent * element[0].clientWidth + 0.5);
        };
        console.log(element[0].clientWidth);

        var pixelToVal = function (pixel) {
          var percent = pixel / element[0].clientWidth;
          return Math.floor(percent * (conf.nbDays) + 0.5);
        };
        console.log(conf.nbDays);
        var addSlot = function (start, end) {
          start = start >= 0 ? start : 0;
          end = end <= conf.nbDays ? end : conf.nbDays;

          var startDate = timeService.addDay(conf.minDate, start);
          var endDate = timeService.addDay(conf.minDate, end);

          console.log(startDate);
          console.log(endDate);

          scope.$apply(function () {
            var item = scope.item;
            if (!item.schedules) {
              item.schedules = [];
            }
            item.schedules.push({start: startDate.toDate(), end: endDate.toDate()});
          });
        };

        var hoverElement = angular.element(element.find('div')[0]);
        var hoverElementWidth = valToPixel(defaultNewScheduleSize);

        hoverElement.css({
          width: hoverElementWidth + 'px'
        });

        element.on('mousemove', function (e) {
          var elOffX = element[0].getBoundingClientRect().left;

          hoverElement.css({
            left: e.pageX - elOffX - hoverElementWidth / 2 + 'px'
          });
        });

        hoverElement.on('click', function (event) {
          if (!element.attr('no-add')) {
            var elOffX = element[0].getBoundingClientRect().left;
            console.log(elOffX);
            var pixelOnClick = event.pageX - elOffX;
            console.log(pixelOnClick);
            var click = event.pageX;
            console.log(click);
            var valOnClick = pixelToVal(pixelOnClick);
            console.log(valOnClick);
            var start = Math.round(valOnClick - defaultNewScheduleSize / 2);
            var end = start + defaultNewScheduleSize;

            console.log(start);
            console.log(end);
            addSlot(start, end);
          }
        });
      }
    };
  }]);
