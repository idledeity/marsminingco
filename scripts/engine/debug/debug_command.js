(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Debug, undefined) { /* Debug submodule namespace */
(function(Command, undefined) { /* Command submodule namespace */

  let commandMap = {};
  let commandHistory = [];
  let commandLog = "";

  // Register a debug command
  //
  Command.register = function(name, description, func) {
    // Check if the command name ahs already been registered
    if (!JJ.System.assert((commandMap[name] === undefined),
      "A debug command has already been registered with the name {0}.", name)) {
      return;
    }

    // Add the command info to the map
    let commandInfo = { name: name, description: description, func: func };
    commandMap[name] = commandInfo;
  }

  // Execute a command string
  //
  Command.execute = function(commandString) {
    // Check that the argument is a valid string
    if (!JJ.System.assert((typeof commandString == "string"),
      "Expected string argument for Command.execute, and got {0}.", (typeof commandString))) {
      return;
    }

    // Store the command in the history
    commandHistory.push(commandString);

    // Split the command into sub strings
    let subStrings = commandString.split(" ");
    if (subStrings.length == 0) {
      // If there are no sub strings, just silently return
      return;
    }

    // Log the command
    Command.printf("> " + commandString);

    // Look-up the command
    const commandInfo = commandMap[subStrings[0]];
    if (commandInfo === undefined) {
      Command.printf("<span class='output_text_warning'>command not recognized: {0}</span>", subStrings[0]);
      return;
    }

    // Execute the command
    let commandArgs = subStrings.slice(1);
    commandInfo.func.apply(this, commandArgs);
  }

  // Prints a formated message to the command log
  //
  Command.printf = function(message, messageArgs) {
    // Format the message
    messageArgs = Array.prototype.slice.call(arguments, 0);
    let formatedMessage = JJ.Utility.String.format.apply(JJ.Utility.String.format, messageArgs);

    // Append the message to the command log
    commandLog += formatedMessage;
    commandLog += "<br>";
  }

  // Writes a formated "info" string to the log
  //
  Command.logInfo = function(message, messageArgs) {
    Command.printf.apply(message, Array.prototype.slice.call(arguments, 0));
  }

  // Writes a formated "warning" string to the log
  //
  Command.logWarning = function(message, messageArgs) {
    arguments[0] = JJ.Utility.String.format("<span class='output_text_warning'>warning: {0}</span>", message);
    Command.printf.apply(Command.printf, arguments);
  }

  // Writes a formated "error" string to the log
  //
  Command.logError = function(message, messageArgs) {
    arguments[0] = JJ.Utility.String.format("<span class='output_text_error'>error: {0}</span>", message);
    Command.printf.apply(Command.printf, arguments);
  }

  // Returns the command history
  //
  Command.getHistory = function() {
    return commandHistory;
  }

  // Returns the command log
  //
  Command.getLog = function() {
    return commandLog;
  }

}(window.JJ.BE.Debug.Command = window.JJ.BE.Debug.Command || {}));
}(window.JJ.BE.Debug = window.JJ.BE.Debug || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));