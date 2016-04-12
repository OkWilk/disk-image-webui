/*
Author:     Oktawiusz Wilk
Date:       10/04/2016
License:    GPL
Purpose:    This file defines the basic structure for the Angular.JS app and enables rendering
            of HTML tags in the popover components.
*/
var AppModule = angular.module("com.itcarlow.okwilk.diskimage", ['ui.bootstrap', 'chart.js', 'smart-table', 'toaster',
    'angular-confirm', 'ngMessages']);

AppModule.filter('unsafe', ['$sce', function ($sce) {
    return function (val) {
        return $sce.trustAsHtml(val);
    };
}]);

angular.module("template/popover/popover.html", []).run(["$templateCache", function ($templateCache) {
    $templateCache.put("template/popover/popover.html",
      "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
      "  <div class=\"arrow\"></div>\n" +
      "\n" +
      "  <div class=\"popover-inner\">\n" +
      "      <h3 class=\"popover-title\" ng-bind-html=\"title | unsafe\" ng-show=\"title\"></h3>\n" +
      "      <div class=\"popover-content\" ng-bind-html=\"content | unsafe\"></div>\n" +
      "  </div>\n" +
      "</div>\n" +
      "");
}]);
