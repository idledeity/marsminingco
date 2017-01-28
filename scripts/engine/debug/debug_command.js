(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Debug, undefined) { /* Debug submodule namespace */

  class CommandManager {
    constructor() {
      this.commandMap = {};
      this.commandHistory = [];
      this.commandLog = "";
    }

    // Register a debug command
    //
    registerCommand(commandName, description, func) {
      // Check if the command name has already been registered
      if (!JJ.System.assert((this.getCommandByName(commandName) == null),
        "A debug command has already been registered with the name {0}.", commandName)) {
        return;
      }

      // Add the command info to the array of commands
      let commandInfo = { name: commandName, description: description, func: func };
      this.commandMap[commandName] = commandInfo;
    }

    // Locate command info with the specified command name
    //
    getCommandByName(commandName) {
      const commandInfo = this.commandMap[commandName];
      if (commandInfo == undefined) {
        return null;
      }

      return commandInfo;
    }

    // Execute a command string
    //
    executeCommand(commandString) {
      // Check that the argument is a valid string
      if (!JJ.System.assert((typeof commandString == "string"),
        "Expected string argument for command to execute, and got {0}.", (typeof commandString))) {
        return;
      }

      // Store the command in the history
      this.commandHistory.push(commandString);

      // Split the command into sub strings
      let subStrings = commandString.split(" ");
      if (subStrings.length == 0) {
        // If there are no sub strings, just silently return
        return;
      }

      // Log the command
      this.printf("> " + commandString);

      // Look-up the command
      const commandInfo = this.getCommandByName(subStrings[0]);
      if (commandInfo == null) {
        this.printf("<span class='output_text_warning'>command not recognized: {0}</span>", subStrings[0]);
        return;
      }

      // Execute the command
      let commandArgs = subStrings.slice(1);
      commandInfo.func.apply(this, commandArgs);
    }

    // Prints a formated message to the command log
    //
    printf(message, messageArgs) {
      // Format the message
      messageArgs = Array.prototype.slice.call(arguments, 0);
      let formatedMessage = JJ.Utility.String.format.apply(JJ.Utility.String.format, messageArgs);

      // Append the message to the command log
      this.commandLog += formatedMessage;
      this.commandLog += "<br>";
    }

    // Writes a formated "info" string to the log
    //
    logInfo(message, messageArgs) {
      this.printf.apply(this, arguments);
    }

    // Writes a formated "warning" string to the log
    //
    logWarning(message, messageArgs) {
      arguments[0] = JJ.Utility.String.format("<span class='output_text_warning'>warning: {0}</span>", message);
      this.printf.apply(this, arguments);
    }

    // Writes a formated "error" string to the log
    //
    logError(message, messageArgs) {
      arguments[0] = JJ.Utility.String.format("<span class='output_text_error'>error: {0}</span>", message);
      this.printf.apply(this, arguments);
    }

    // Returns the command history
    //
    getHistory() {
      return this.commandHistory;
    }

    // Returns the command log
    //
    getLog() {
      return this.commandLog;
    }
  }

  // The debug command manager
  Debug.commandMgr = new CommandManager();

}(window.JJ.BE.Debug = window.JJ.BE.Debug || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));