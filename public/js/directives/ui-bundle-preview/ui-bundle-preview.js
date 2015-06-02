angular.module("das.system")
.directive('uiBundlePreview', function($timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {
            bundle: '=bundle',
            callback: '=callback',
            size: '@'
        },
        templateUrl: '/js/directives/ui-bundle-preview/ui-bundle-preview.html',
        link: function($scope, $elem, $attrs) {
            $scope.class = {};
            $scope.class[$scope.size] = true;

            var labels = [{
                photo: $scope.bundle.photo,
                label: ''
            }];
            _.each($scope.bundle.contributions, function(contribution) {
                labels.push({
                    photo: contribution.user.photo,
                    label: contribution.user.firstname + ' ' + contribution.user.surname + '\'s in'
                });
            });

            var delay = 3000 / 360;
            var initialDelay = 6000;
            var index = 0;

            var arc = $elem.find('path');
            var $img = $elem.find("img");
            var $label = $elem.find(".ui-bundle-preview-label");
            var stroke_width = 0;
            if($scope.size == 'large') {
                stroke_width = 6;
                arc.attr("stroke-width", "6px");
            }
            else {
                stroke_width = 4;
                arc.attr('stroke-width', "4px");
            }

            var angle = 180;
            var polarToCartesian = function (centerX, centerY, radius, angleInDegrees) {
                var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

                return {
                    x: centerX + (radius * Math.cos(angleInRadians)),
                    y: centerY + (radius * Math.sin(angleInRadians))
                };
            };
            var describeArc = function (x, y, radius, startAngle, endAngle){

                var start = polarToCartesian(x, y, radius, endAngle);
                var end = polarToCartesian(x, y, radius, startAngle);

                var arcSweep = endAngle - startAngle > 0 ? "0" : "1";

                var d = [
                    "M", start.x, start.y, 
                    "A", radius, radius, 0, arcSweep, 0, end.x, end.y
                ].join(" ");

                return d;       
            };
            var drawArc = function() {
                var width = $elem.find('svg').width();
                var height = $elem.find('svg').height();
                angle  = (angle + 1 ) % 360;
                arc[0].setAttribute("d", describeArc(width/2, height/2, width/2 - stroke_width/2, 180, angle));
                $timeout(drawArc, delay);

                if(angle == 179) {
                    index = (index + 1) % labels.length;
                    $img.attr('src', labels[index].photo);
                    $label.html(labels[index].label);
                }
            };
            $timeout(drawArc, initialDelay);
        }
    };
});