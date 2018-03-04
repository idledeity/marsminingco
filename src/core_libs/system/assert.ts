import * as Strings from "../../core_libs/utility/string.js"; 

let assertsEnabled = true;
let assertsOpenDialog = true;
let assertsBreakToDebugger = true;

/**
 * Checks the passed condition and raises an assertion if the condition evaluates as false
 * @param {boolean} condition - The condition to be evaluated
 * @param {string} message - A debug message to be displayed in the case the assert is raised
 * @param {any[]} messageArgs - Array of arguments for the formatted message string
 * @return {boolean} The passed condition is returned so that you can wrap an assert inside a conditional to handle
 *                    the failed condition
 */
export default function assert(condition, message, ...messageArgs) {
  // Check if asserts are enabled
  if (assertsEnabled) {
    // Check the condition provided
    if (!condition) {
      // Format the message if necessary
      let formatedMessage = message;
      if (arguments.length >= 3) {
        // Generate a formated message
        messageArgs = Array.prototype.slice.call(arguments, 1);
        formatedMessage = Strings.format.apply(Strings.format, messageArgs);
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

      let breakToDebugger = assertsBreakToDebugger;

      // Maybe display a modal dialog
      if (assertsOpenDialog) {
        const dialogString = "Asserton failed!\n" + formatedMessage + "\n\n" + stackFunctionArray[0];

        if (breakToDebugger) {
          if (!window.confirm(dialogString)) {
            breakToDebugger = false;
          }
        } else {  
          window.alert(dialogString);
        }
      }

      // Maybe force the debugger to break
      if (breakToDebugger) {
        try {
          throw "assert hit";
        } catch(e) { }        
      }
    }
  }

  // Always return the condition value (even if not enabled)
  return condition;
}
