(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  (function(System, undefined) { /* System submodule namespace */

    let assertsEnabled = true;
    let assertsOpenDialog = true;

    // System assertion function that checks the passed condition and raises an assertion if it is not met (false)
    //
    System.assert = function(condition, message, messageArgs) {
      // Check if asserts are enabled
      if (assertsEnabled) {
        // Check the condition provided
        if (!condition) {
          // Format the message if necessary
          let formatedMessage = message;
          if (arguments.length >= 3) {
            // Generate a formated message
            messageArgs = Array.prototype.slice.call(arguments, 1);
            formatedMessage = MMC.Utility.String.format.apply(MMC.Utility.String.format, messageArgs);
          }

          // Generate an error to obtain the callstack
          const error = new Error();

          // Convert the callstack from the error into an array of function calls, and then remove the first entry
          let stackFunctionArray = error.stack.toString().split("\n");
          stackFunctionArray.shift();

          // Print to the console log
          console.log("Assertion failed! @ " + stackFunctionArray[0]);
          console.log(formatedMessage);
          console.log("");
          console.log("Call Stack:");
          stackFunctionArray.forEach(function(stackFunction) {
            console.log(stackFunction);
          });

          // Maybe display a modal dialog
          if (assertsOpenDialog) {
            const dialogString = "Asserton failed!\n" + formatedMessage + "\n\n" + stackFunctionArray[0];
            window.alert(dialogString);
          }
        }
      }

      // Always return the condition value (even if not enabled)
      return condition;
    }

  }(window.MMC.System = window.MMC.System || {}));
}(window.MMC = window.MMC || {}));