import { commandMgr, CommandInfo } from "./command_manager.js";

/**
 * Developer command to search all developer commands
 */
commandMgr.registerCommand("find", "Search command names and descriptions to find commands", function(searchString: string) {
  // Check that the search string argument is valid
  if ((searchString == undefined) || (searchString == "")) {
    commandMgr.logWarning("Missing searchString argument. Expected usage: {0}", this.funcSignature);
    return;
  }

  // Find commands that contain the specified substring
  let commandInfos = commandMgr.findCommands(searchString, true);

  // Sort the commands alphabeticaly by name
  commandInfos.sort(function(a, b) {
    return a.name.localeCompare(b.name);
  });

  // Generate a RegExp from the searchstring so we can find all occurances for highlighting
  const regExp = new RegExp(searchString, "gi"); // (g)lobal, case (i)nsensitive

  // Print the number of results found
  commandMgr.logInfo("&emsp;{0} results found for: <span class='output_text_match'>{1}</span>", String(commandInfos.length), searchString);

  // Display the found results
  for (let commandIndex = 0; commandIndex < commandInfos.length; commandIndex++) {
    // Get the current command info
    const commandInfo = commandInfos[commandIndex];

    // Fuction to wrap substring in colored span tags
    const colorizeSubStringFunc = function(string) {
      let colorizedString = "";
      let substrStartIndex = 0;
      let match = null;
      while ((match = regExp.exec(string)) != null) {
        // Add the substring before the match
        colorizedString += string.substr(substrStartIndex, (match.index - substrStartIndex));
        colorizedString += "<span class='output_text_match'>";
        colorizedString += match[0];
        colorizedString += "</span>";
        substrStartIndex = match.index + match[0].length;
      }
      colorizedString += string.substr(substrStartIndex, (string.length - substrStartIndex));

      return colorizedString;
    }

    // Generate a "colorized" string for the command name and description to highlight matching text
    const colorizedName = colorizeSubStringFunc(commandInfo.name);
    let colorizedDescription = colorizeSubStringFunc(commandInfo.description);

    // Log the colorized name and description
    commandMgr.logInfo("{0}&emsp;&emsp;<span class='output_text_comment'>// {1}</span>",
      colorizedName, colorizedDescription);
  }
});

/**
 * Developer command that prints a function's signature
 */
commandMgr.registerCommand("help", "Show a command's function signature for proper usage.", function(commandName: string) {
  // Check that the commandName argument is valid
  if ((commandName == undefined) || (commandName == "")) {
    commandMgr.logInfo("This is the debug console, where you can enter developer commands.");
    commandMgr.logInfo("");
    commandMgr.logInfo("List of base commands:");
    commandMgr.logInfo(" * list - Display the list of all developer commands.");
    commandMgr.logInfo(" * find <search string> - Search command name and description for the search string.");
    commandMgr.logInfo(" * help <command name> - Display additional information about the given command.");
    commandMgr.logInfo("");
    commandMgr.logInfo("Additional Tips:");
    commandMgr.logInfo(" * [Tab] auto-completion is supported to complete partial commands.");
    commandMgr.logInfo(" * [Up] and [Down] arrows will cycle through the history of recent commands.");
    return;
  }

  // Get the command info
  let commandInfo = commandMgr.getCommandInfoByName(commandName);
  if (commandInfo == null) {
    commandMgr.logWarning("Command \"{0}\" not found. Expected usage: {1}", commandName, this.funcSignature);
    return;
  }

  // Print the function's signature to the log info
  commandMgr.logInfo("Description: {0}", commandInfo.description);
  commandMgr.logInfo("Usage: {0}", commandInfo.funcSignature);
});

/**
 * Developer command that displays all registered developer commands
 */
commandMgr.registerCommand("list", "Lists all registered developer commands.", function() {
  // Loop over all the commands and print their name & description
  commandMgr.getCommandMap().forEach(function(commandInfo: CommandInfo, key: string) {
      // Log the command name and description
      commandMgr.logInfo("{0}&emsp;&emsp;<span class='output_text_comment'>// {1}</span>", commandInfo.name, commandInfo.description);
  });
});
