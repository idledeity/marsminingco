(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function(System, undefined) { /* System submodule namespace */
(function(IO, undefined) { /* IO submodule namespace */

  /**
   * Requests a file from the site asynchronously, notifying the caller by the callback function when complete
   * @param {String} filePath - Filename and path of the file to retrieve
   * @param {JJ.System.IO~requestFileAsyncCBFunc} calbackFunction - Function called when the request has been completed
   * @param {String} [mimeType] - Override for the XMLHttpRequest mime type
   * @return {Object} The XMLHttpRequest object
   */
  JJ.System.IO.requestFileAsync = function(filePath, callbackFunction, mimeType) {
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
  /**
   * @callback JJ.System.IO~requestFileAsyncCBFunc
   * @param {Boolean} success - True if the file request completed successfulu, False if the request failed
   * @param {String} filePath - The path to the file that was requested
   * @param {String} responseText - The text received for the requested file
   * @return {Boolean} True to stop processing, False (or nothing) to continue processing the list of elements
   */

  /**
   * Requests a file from the site synchronously, blocking execution until the file has MMCen retrieved
   * @param {String} filePath - Filename and path of the file to retrieve
   * @param {String} [mimeType] - Override for the XMLHttpRequest mime type
   * @return {String} The response text from the request
   */
  JJ.System.IO.requestFileBlocking = function(filePath, mimeType) {
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