/**
 * Enumeration of file request results
 * @enum {number}
 */
export enum FileRequestResult {
  SUCCESS,
  ABORT,
  ERROR,
}

/**
 * Requests a file from the site asynchronously, notifying the caller by the callback function when complete
 * @param {string} filePath - Filename and path of the file to retrieve
 * @param {~requestFileAsyncCBFunc} calbackFunction - Function called when the request has been completed
 * @param {string} [mimeType] - Override for the XMLHttpRequest mime type
 * @return {Object} The XMLHttpRequest object
 */
/**
 * @callback ~requestFileAsyncCBFunc
 * @param {string} filePath - The path to the file that was requested
 * @param {FileRequestResult} result - Result of the request
 * @param {string} responseText - The text received for the requested file
 * @return {boolean} True to stop processing, False (or nothing) to continue processing the list of elements
 */
export function requestFileAsync(filePath: string, 
  callbackFunction: (filePath: string, result: FileRequestResult, responseText: string) => void, mimeType: string) {

  // Create a new XML Http request
  let request = new XMLHttpRequest();

  // Register callback functions for when the request completes
  request.addEventListener("load", function requestListener() {
      callbackFunction(filePath, FileRequestResult.SUCCESS, this.responseText);
  });
  request.addEventListener("abort", function requestListener() {
      callbackFunction(filePath, FileRequestResult.ABORT, this.responseText);
  });
  request.addEventListener("error", function requestListener() {
      callbackFunction(filePath, FileRequestResult.ERROR, this.responseText);
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
 * Requests a file from the site synchronously, blocking execution until the file has MMCen retrieved
 * @param {string} filePath - Filename and path of the file to retrieve
 * @param {string} [mimeType] - Override for the XMLHttpRequest mime type
 * @return {[boolean, string]} Tuple containing boolean (success|failure) and the file response text as a string
 */
export function requestFileBlocking(filePath: string, mimeType: string): [boolean, string] {
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
  return [request.readyState === XMLHttpRequest.DONE, request.responseText];
}
