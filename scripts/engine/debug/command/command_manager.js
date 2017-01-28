(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Debug, undefined) { /* Debug submodule namespace */

  // The CommandManager handles storing and accessing the game's debug developer commands
  //
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

      // Parse the functions arguments
      let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      let ARGUMENT_NAMES = /([^\s,]+)/g;
      let fnStr = func.toString().replace(STRIP_COMMENTS, '');
      let funcArguments = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if(funcArguments === null)
         funcArguments = [];

      // Turn the function arguments into a string representing the function's signature
      let funcSignature = JJ.Utility.String.format("{0}", commandName);
      for (let argumentIndex = 0; argumentIndex < funcArguments.length; argumentIndex++) {
        funcSignature += JJ.Utility.String.format(" &lt;{0}&gt;", funcArguments[argumentIndex]);
      }

      // Add the command info to the array of commands
      let commandInfo = { name: commandName, description: description, func: func, signature: funcSignature };
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

    // Find commands by substring
    //
    findCommands(searchString, searchDescription, caseSensitive) {
      // Initialize the array of found commands that match the searc regExp
      let foundCommands = [];

      // Ensure the search string is indeed a string
      if (!JJ.System.assert(typeof searchString === "string")) {
        return foundCommands;
      }

      // Convert to a RegExp and perform the search
      const regExp = new RegExp(searchString, (caseSensitive ? undefined : "i"));
      return this.searchCommands(regExp, searchDescription);
    }

    // Find commands by Regular Expression
    //
    searchCommands(regExp, searchDescription) {
      // Initialize the array of found commands that match the searc regExp
      let foundCommands = [];

      // Ensure the regExp is a proper RegExp object
      if (!(regExp instanceof RegExp)) {
        regExp = new RegExp(regExp);
      }

      // Loop over all of the command infos in the command map
      for (let property in this.commandMap) {
        // Ensure this is a prototype property
        if (!this.commandMap.hasOwnProperty(property)) {
          continue;
        }

        // Get the command info
        const commandInfo = this.commandMap[property];

        // Perform the search
        if (regExp.test(commandInfo.name)) {
          // The command name matches the regExp
          foundCommands.push(commandInfo);
        } else if (searchDescription && regExp.test(commandInfo.description)) {
          // The command description matches the regExp
          foundCommands.push(commandInfo);
        }
      }

      // Return the array of found commands
      return foundCommands;
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
        this.printf("<span class='output_text_warning'>Command not recognized: {0}</span>", subStrings[0]);
        return;
      }

      // Execute the command
      let commandArgs = subStrings.slice(1);
      commandInfo.func.apply(commandInfo, commandArgs);
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
      arguments[0] = JJ.Utility.String.format("<span class='output_text_warning'>Warning: {0}</span>", message);
      this.printf.apply(this, arguments);
    }

    // Writes a formated "error" string to the log
    //
    logError(message, messageArgs) {
      arguments[0] = JJ.Utility.String.format("<span class='output_text_error'>Error: {0}</span>", message);
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