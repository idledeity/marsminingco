(function (JJ, undefined) { /* JJ module namespace */
  "use strict";

(function(Utility, undefined) { /* Utility submodule namespace */
(function(String, undefined) { /* String submodule namespace */

  // A simple string formating function that accepts a format string, and an arbitrary number of additional arguments.
  //
  // The function scans the format string for numbered parameters in brackets (ex. "{0}"), replacing each parameter
  // with the numbered argument.
  //
  String.format = function(format, formatArgs) {
    // If there aren't at least 2 arguments, just return the unformated stirng
    if (arguments.length < 2) {
      return format;
    }

    // Format the string, replacing all tags with the list of arguments
    formatArgs = Array.prototype.slice.call(arguments, 1);
    let formatedString = format.replace(/{(\d+)}/g, function(match, number) {
      return ((formatArgs[number] !== undefined) ? formatArgs[number] : match);
    });

    // Return the formated string
    return formatedString;
  }

}(window.JJ.Utility.String = window.JJ.Utility.String || {}));
}(window.JJ.Utility = window.JJ.Utility || {}));
}(window.JJ = window.JJ || {}));
