/***
GLobal Directives
***/

// Route State Load Spinner(used on page or content load)
angular.module('das.system')
    .directive('bfFormError', [ function() {
        return {
            restrict: 'E',
            scope: {
                message:  '=message'
            },
            template: '<div class="bf-form-error-container"><div class="icon">!</div><center>{{message}}</center></div>',
            replace: true,
            //controller: ['$scope', '$element', controller($log, $interpolate, d3, d3h, chartService)]
            controller: ['$scope', '$element', function($scope, $element) {
            }]
        };
    }]);

// Handle global LINK click
angular.module('das.system').directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function(e) {
                    e.preventDefault(); // prevent link click for above criteria
                });
            }
        }
    };
});

// Photo-uploader
angular.module("das.system")
    .directive('photoUploader', function() {
        return {
            restrict: 'A',
            scope: {
                callback:'=photoUploader'
            },
            link: function($scope, $elem, $attrs) {
                $elem.css('position', 'relative');
                $elem.append('<input type="file" class="photo-uploader-file" />');

                $elem.find('input[type=file].photo-uploader-file')
                    .change(function() {
                        filepicker.setKey(FILEPICKER_API_KEY);
                        filepicker.store(
                            this,
                            function(result){
                                $scope.callback( result.url );
                            }
                        );
                    });
                
            }
        };
})
.directive('uiBundleProgressBar', function() {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            percent:'=ngPercent'
        },
        template: '<div class="bundle-progress-bar-container"><div class="bundle-progress-bar"></div></div>',
        link: function($scope, $elem, $attrs) {

            $scope.$watch('percent', function() {
                $elem.find('.bundle-progress-bar').css('width', $scope.percent + '%');
            }, true);
        }
    };
})
.directive('ngReturn', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngReturn);
                });

                event.preventDefault();
            }
        });
    };
})
.directive('ngInitialFocus', ['$timeout', function ($timeout) {
    return function (scope, element, attrs) {
        $timeout(function() {
            element.focus();
        });
    };
}])
.directive('uiBundleOptions', function() {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            model:'=ngModel',
            settings:'=ngSettings',
            options:'=ngOptions'
        },
        templateUrl: '/js/directives/ui-bundle-options/ui-bundle-options.html',
        link: function($scope, $elem, $attrs) {
            var settings = _.extend({
                width: 12,
                height: 12,
                space: 0,
                font: '30px'
            }, $scope.settings);

            $scope.style = {
                'margin-top': settings.space + 'px',
                'font-size': settings.font
            };
            $scope.disc_style = {
                width:settings.width + 'px',
                height:settings.height + 'px'
            };
            $scope.setOption= function(option) {
                $scope.model = option;
            };
        }
    };
})
.directive('uiBundleSegment', function() {
    return {
        restrict: 'E',
        replace: 'true',
        scope: {
            model:'=ngModel',
            options:'=ngOptions'
        },
        templateUrl: '/js/directives/ui-bundle-segment/ui-bundle-segment.html',
        link: function($scope, $elem, $attrs) {
            $scope.style = {
                width:(100/$scope.options.length) + '%',
                height:'100%'
            };
            $scope.setOption= function(option) {
                $scope.model = option;
            };
        }
    };
})
.directive('uiBundleInputAutoFill', function() {
    return {
        restrict: 'A',
        scope: {
            model: '=ngModel'
        },
        link: function($scope, $elem, $attrs) {
            $scope.fontSize = parseInt($elem.css('font-size'));
            $scope.height = $elem.height();
            var changeFontSize = function(lastStatus) {
                var fontSize = parseInt($elem.css('font-size'));
                if ( $elem[0].scrollWidth > $elem.innerWidth() && fontSize >= 10) {
                    fontSize -= 2;
                    $elem.css('font-size', fontSize + 'px');
                    if(lastStatus === -1 || lastStatus === 1) {
                        changeFontSize(1);
                    }
                }
                else if(fontSize < $scope.fontSize && (lastStatus === -1 || lastStatus === 0)){
                    fontSize += 2;
                    $elem.css('font-size', fontSize + 'px');
                    changeFontSize(0);
                }
            };
            $scope.$watch('model', function() {
                if($scope.model !== "") {
                    changeFontSize(-1);
                }
                else {
                    $elem.css('font-size', $scope.fontSize + 'px');
                }
                $elem.height($scope.height);
            }, true);
        }
    };
});