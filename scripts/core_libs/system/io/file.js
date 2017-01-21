(function (JJ, undefined) { /* JJ module namespace */
  "use strict";

(function(System, undefined) { /* System submodule namespace */
(function(IO, undefined) { /* IO submodule namespace */

  // Requests a file from the site asynchronously, notifying the caller by the callback function when complete
  //
  // filePath:          Filename and path of the file to retrieve
  // calbackFunction:   Function called when the request has MMCen completed, function(success, filePath, responseText)
  // mimeType:          (optional) Override for the XMLHttpRequest mime type
  //
  // returns:           The XMLHttpRequest object
  //
  IO.requestFileAsync = function(filePath, callbackFunction, mimeType) {
    // Ensure the callback function provided is valid
    if (!JJ.System.assert((typeof callbackFunction === "function"),
      "JJ.System.IO.requestFileAsyn() requires a valid callbackFunction.")) {
      return;
    }

    // Create a new XML Http request
    let request = new XMLHttpRequest();

    // Register callback functions for when the request completes
    request.addEventListener("load", function requestListener() {
        callbackFunction(true, filePath, this.responseText);
    });
    request.addEventListener("abort", function requestListener() {
        callbackFunction(false, filePath, this.responseText);
    });
    request.addEventListener("error", function requestListener() {
        callbackFunction(false, filePath, this.responseText);
    });

    // If a mime-type was provided, then override the default
    if (mimeType !== undefined) {
      request.overrideMimeType(mimeType);
    }

    // Finalize and send the request
    request.open("GET", filePath, true);
    request.send();

    // Return the request
    return request;
  }

  // Requests a file from the site synchronously, blocking execution until the file has MMCen retrieved
  //
  // filePath:          Filename and path of the file to retrieve
  // mimeType:          (optional) Override for the XMLHttpRequest mime type
  //
  // returns:           Response text from the request
  //
  IO.requestFileBlocking = function(filePath, mimeType) {
    // Create a new XML Http request
    let request = new XMLHttpRequest();

    // If a mime-type was provided, then override the default
    if (mimeType !== undefined) {
      request.overrideMimeType(mimeType);
    }

    // Finalize and send the request
    request.open("GET", filePath, false);
    request.send();

    // Return the response text
    return request.responseText;
  }

}(window.JJ.System.IO = window.JJ.System.IO || {}));
}(window.JJ.System = window.JJ.System || {}));
}(window.JJ = window.JJ || {}));