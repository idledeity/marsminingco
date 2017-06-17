(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Debug, undefined) { /* Debug submodule namespace */

  /**
   * The CommandManager handles storing and accessing the game's debug developer commands
   */
  class CommandManager {
    /**
     * Constructor
     */
    constructor() {
      this.commandMap = {};
      this.commandHistory = [];
      this.commandLog = "";
    }

    /**
     * Registers a new debug command to be managed by this manager
     * @param {String} commandName - The name of the debug command [Must be unique!]
     * @param {String} description - A brief description of the command's intended use
     * @param {Function} commandFunc - The actual function to be invoked when the command is executed
     * @return {Boolean} True if the command was successfully registe, False if there was an error
     */
    registerCommand(commandName, description, commandFunc) {
      // Check if the command name has already been registered
      if (!JJ.System.assert((this.getCommandByName(commandName) == null),
        "A debug command has already been registered with the name {0}.", commandName)) {
        return false;
      }

      // Parse the functions arguments
      let STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
      let ARGUMENT_NAMES = /([^\s,]+)/g;
      let fnStr = commandFunc.toString().replace(STRIP_COMMENTS, '');
      let funcArguments = fnStr.slice(fnStr.indexOf('(')+1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
      if(funcArguments === null)
         funcArguments = [];

      // Turn the function arguments into a string representing the function's signature
      let funcSignature = JJ.Utility.String.format("{0}", commandName);
      for (let argumentIndex = 0; argumentIndex < funcArguments.length; argumentIndex++) {
        funcSignature += JJ.Utility.String.format(" &lt;{0}&gt;", funcArguments[argumentIndex]);
      }

      // Add the command info to the array of commands
      let commandInfo = { name: commandName, description: description, func: commandFunc, signature: funcSignature };
      this.commandMap[commandName] = commandInfo;

      return true;
    }

    /**
     * Locate command info for the specified command name
     * @return {Object} An object containing the relavant info for the requested command
     */
    getCommandByName(commandName) {
      const commandInfo = this.commandMap[commandName];
      if (commandInfo == undefined) {
        return null;
      }

      return commandInfo;
    }

    /**
     * Find a list of commands by substring
     * @param {String} searchString - The substring to search for
     * @param {Boolean} searchDescription - True if the search should include command descriptions, False if it should
     *    only include the command name
     * @param {Boolean} caseSensitive - True if the search should be case sensitive, False if it should not
     * @return {Object[]} An array of objects containing the command info for each command matching the search
     *    parameters
     */
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

    /**
     * Find commands by Regular Expression
     * @param {String} regExp - A RegEx string to use to search filter the commands
     * @param {Boolean} searchDescription - True if the search should include command descriptions, False if it should
     *    only include the command name
     * @return {Objecct[]} An array of objects containing the command info for each command matching the search
     *    parameters
     */
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

    /**
     * Execute a command stirng with any required or optional arguments
     * @param {String} commandString - The command string to be executed
     */
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
        this.logWarning("Command not recognized: {0}", subStrings[0]);
        return;
      }

      // Execute the command
      let commandArgs = subStrings.slice(1);
      commandInfo.func.apply(commandInfo, commandArgs);
    }

    /**
     * Prints a formated message to the command log
     * @param {String} message - The format of the message to be printed to the command log
     * @param {Object[]} messageArgs - An array of arguement to be used by an formatting in the message string
     */
    printf(message, messageArgs) {
      // Format the message
      messageArgs = Array.prototype.slice.call(arguments, 0);
      let formatedMessage = JJ.Utility.String.format.apply(JJ.Utility.String.format, messageArgs);

      // Append the message to the command log
      this.commandLog += formatedMessage;
      this.commandLog += "<br>";
    }

    /**
     * Prints a formated message to the command log as a generic log message
     * @param {String} message - The format of the message to be printed to the command log
     * @param {Object[]} messageArgs - An array of arguement to be used by an formatting in the message string
     */
    logInfo(message, messageArgs) {
      arguments[0] = JJ.Utility.String.format("<span class='output_text_info'>{0}</span>", message);
      this.printf.apply(this, arguments);
    }

    /**
     * Prints a formated message to the command log as a warning message
     * @param {String} message - The format of the message to be printed to the command log
     * @param {Object[]} messageArgs - An array of arguement to be used by an formatting in the message string
     */
    logWarning(message, messageArgs) {
      arguments[0] = JJ.Utility.String.format("<span class='output_text_warning'>Warning:<br>{0}</span>", message);
      this.printf.apply(this, arguments);
    }

    /**
     * Prints a formated message to the command log as an error message
     * @param {String} message - The format of the message to be printed to the command log
     * @param {Object[]} messageArgs - An array of arguement to be used by an formatting in the message string
     */
    logError(message, messageArgs) {
      arguments[0] = JJ.Utility.String.format("<span class='output_text_error'>Error:<br>{0}</span>", message);
      this.printf.apply(this, arguments);
    }

    /**
     * Returns the command history
     * @return {String[]} An array of strings for the complete history of each command that has been executed
     */
    getHistory() {
      return this.commandHistory;
    }

    /**
     * Returns the command log
     * @return {String} The entire command log for the current session
     */
    getLog() {
      return this.commandLog;
    }
  }

  // The debug command manager
  JJ.BE.Debug.commandMgr = new CommandManager();

}(window.JJ.BE.Debug = window.JJ.BE.Debug || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));