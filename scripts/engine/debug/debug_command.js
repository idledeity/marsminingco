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

  // Developer command to search for developer commands
  Debug.commandMgr.registerCommand("find", "search command names and descriptions", function(searchString) {
    if (searchString == undefined) {
      Debug.commandMgr.logWarning("Missing searchString argument.");
      Debug.commandMgr.logInfo("Expected usage: \"find &lt;searchString&gt;\"");
      return;
    }

    // Find commands that contain the specified substring
    let commandInfos = Debug.commandMgr.findCommands(searchString, true);

    // Sort the commands alphabeticaly by name
    commandInfos.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    // Generate a RegExp from the searchstring so we can find all occurances for highlighting
    const regExp = new RegExp(searchString, "gi"); // (g)lobal, case (i)nsensitive

    // Print the number of results found
    Debug.commandMgr.logInfo("&emsp;{0} results found for: <span class='output_text_match'>{1}</span>",
      commandInfos.length, searchString);

    // Display the found results
    for (let commandIndex = 0; commandIndex < commandInfos.length; commandIndex++) {
      // Get the current command info
      const commandInfo = commandInfos[commandIndex];

      // Generate a "colorized" string for the command name to highlight matching text
      let colorizedName = "";
      let substrStartIndex = 0;
      let match = null;
      while ((match = regExp.exec(commandInfo.name)) != null) {
        // Add the substring before the match
        colorizedName += commandInfo.name.substr(substrStartIndex, (match.index - substrStartIndex));
        colorizedName += "<span class='output_text_match'>";
        colorizedName += match[0];
        colorizedName += "</span>";
        substrStartIndex = match.index + match[0].length;
      }
      colorizedName += commandInfo.name.substr(substrStartIndex, (commandInfo.name.length - substrStartIndex));

      // Generate a "colorized" string for the command description to highlight matching text
      let colorizedDescription = "";
      substrStartIndex = 0;
      while ((match = regExp.exec(commandInfo.description)) != null) {
        // Add the substring before the match
        colorizedDescription += commandInfo.description.substr(substrStartIndex, (match.index - substrStartIndex));
        colorizedDescription += "<span class='output_text_match'>";
        colorizedDescription += match[0];
        colorizedDescription += "</span>";
        substrStartIndex = match.index + match[0].length;
      }
      colorizedDescription += commandInfo.description.substr(substrStartIndex,
        (commandInfo.description.length - substrStartIndex));

      // Log the colorized name and description
      Debug.commandMgr.logInfo("{0}&emsp;&emsp;<span class='output_text_comment'>// {1}</span>",
        colorizedName, colorizedDescription);
    }
  });


}(window.JJ.BE.Debug = window.JJ.BE.Debug || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));