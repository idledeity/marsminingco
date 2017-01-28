(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Debug, undefined) { /* Debug submodule namespace */

  // Developer command to search all developer commands
  //
  Debug.commandMgr.registerCommand("find", "Search command names and descriptions to find commands",
    function(searchString) {

    // Check that the search string argument is valid
    if ((searchString == undefined) || (searchString == "")) {
      Debug.commandMgr.logWarning("Missing searchString argument. Expected usage: {0}", this.signature);
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
      Debug.commandMgr.logInfo("{0}&emsp;&emsp;<span class='output_text_comment'>// {1}</span>",
        colorizedName, colorizedDescription);
    }
  });

  // Developer command that prints a function's signature
  //
  Debug.commandMgr.registerCommand("help", "Show a command's function signature for proper usage.",
    function(commandName) {

    // Check that the commandName argument is valid
    if ((commandName == undefined) || (commandName == "")) {
      Debug.commandMgr.logWarning("Missing commandName argument. Expected usage: {0}", this.signature);
      return;
    }

    // Get the command info
    let commandInfo = Debug.commandMgr.getCommandByName(commandName);
    if (commandInfo == null) {
      Debug.commandMgr.logWarning("Command \"{0}\" not found. Expected usage: {0}", commandName, this.signature);
      return;
    }

    // Print the function's signature to the log info
    Debug.commandMgr.logInfo("Usage: {0}", commandInfo.signature);
  });

}(window.JJ.BE.Debug = window.JJ.BE.Debug || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));