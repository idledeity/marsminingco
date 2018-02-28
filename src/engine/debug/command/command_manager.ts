import assert from "../../../core_libs/system/assert.js";
import * as Strings from "../../../core_libs/utility/string.js";

export class CommandInfo {
  public readonly name: string;           // The name of the command (used to execute the command)
  public readonly description: string;    // The description of the command (used for help info)
  public readonly funcSignature: string;  // The function signature of the command (used for help info)
  public readonly commandFunc: (...args: string[]) => void;  // The command function which is executed whent he command is triggered
  
  constructor(name: string, description: string, funcSignature: string, commandFunc: (...args: string[]) => void) {
    this.name = name;
    this.description = description;
    this.funcSignature = funcSignature;
    this.commandFunc = commandFunc;
  }
}

/**
 * The CommandManager handles storing and accessing the game's debug developer commands
 */
export class CommandManager {
  private commandMap: Map<string, CommandInfo>;
  private commandHistory: string[];
  private commandLog: string;
  
  /**
   * Constructor
   */
  constructor() {
    this.commandMap = new Map<string, CommandInfo>();
    this.commandHistory = [];
    this.commandLog = "";
  }

  /**
   * Registers a new debug command to be managed by this manager
   * @param {string} commandName - The name of the debug command [Must be unique!]
   * @param {string} description - A brief description of the command's intended use
   * @param {(args: string[]) => void} commandFunc - The actual function to be invoked when the command is executed
   * @return {boolean} True if the command was successfully registe, False if there was an error
   */
  registerCommand(commandName: string, description: string, commandFunc: (...args: string[]) => void) {
    // Check if the command name has already been registered
    if (!assert((this.getCommandInfoByName(commandName) == null),
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
    let funcSignature = Strings.format("{0}", commandName);
    for (let argumentIndex = 0; argumentIndex < funcArguments.length; argumentIndex++) {
      funcSignature += Strings.format(" &lt;{0}&gt;", funcArguments[argumentIndex]);
    }

    // Add the command info to the array of commands
    this.commandMap.set(commandName, new CommandInfo(commandName, description, funcSignature, commandFunc));
    return true;
  }

  /**
   * Locate command info for the specified command name
   * @param {string} commandName - The name of the command to look ups
   * @return {CommandInfo} The command info for the specified command, or {null} if not matching command info found
   */
  getCommandInfoByName(commandName: string): CommandInfo {
    const commandInfo = this.commandMap.get(commandName);
    if (commandInfo == undefined) {
      return null;
    }

    return commandInfo;
  }

  /**
   * Find a list of commands by substring
   * @param {string} searchString - The substring to search for
   * @param {boolean} searchDescription - True if the search should include command descriptions, False if it should
   *    only include the command name
   * @param {boolean} caseSensitive - True if the search should be case sensitive, False if it should not
   * @return {CommandInfo[]} An array of objects containing the command info for each command matching the search parameters
   */
  findCommands(searchString: string, searchDescription: boolean = false, caseSensitive: boolean = false): CommandInfo[] {
    // Convert to a RegExp and perform the search
    const regExp = new RegExp(searchString, (caseSensitive ? undefined : "i"));
    return this.searchCommands(regExp, searchDescription);
  }

  /**
   * Find commands by Regular Expression
   * @param {RegExp} regExp - A RegEx string to use to search filter the commands
   * @param {boolean} searchDescription - True if the search should include command descriptions, False if it should
   *    only include the command name
   * @return {CommandInfo[]} An array of objects containing the command info for each command matching the search
   *    parameters
   */
  searchCommands(regExp: RegExp, searchDescription: boolean): CommandInfo[] {
    // Initialize the array of found commands that match the searc regExp
    let foundCommands: CommandInfo[] = [];

    // Loop over all of the command infos in the command map
    this.commandMap.forEach(function(commandInfo: CommandInfo, key: string) {
      // Perform the search
      if (regExp.test(commandInfo.name)) {
        // The command name matches the regExp
        foundCommands.push(commandInfo);
      } else if (searchDescription && regExp.test(commandInfo.description)) {
        // The command description matches the regExp
        foundCommands.push(commandInfo);
      }
    });

    // Return the array of found commands
    return foundCommands;
  }

  /**
   * Execute a command stirng with any required or optional arguments
   * @param {string} commandString - The command string to be executed
   */
  executeCommand(commandString: string) {
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
    const commandInfo = this.getCommandInfoByName(subStrings[0]);
    if (commandInfo == null) {
      this.logError("Command not recognized: {0}", subStrings[0]);
      return;
    }

    // Execute the command
    let commandArgs = subStrings.slice(1);
    commandInfo.commandFunc.apply(commandInfo, commandArgs);
  }

  /**
   * Prints a formated message to the command log
   * @param {string} message - The format of the message to be printed to the command log
   * @param {string[]} messageArgs - An array of arguement to be used by an formatting in the message string
   */
  printf(message: string, ...messageArgs: string[]) {
    // Format the message
    messageArgs = Array.prototype.slice.call(arguments, 0);
    let formatedMessage = Strings.format.apply(Strings.format, messageArgs);

    // Append the message to the command log
    this.commandLog += formatedMessage;
    this.commandLog += "<br>";
  }

  /**
   * Prints a formated message to the command log as a generic log message
   * @param {string} message - The format of the message to be printed to the command log
   * @param {string[]} messageArgs - An array of arguement to be used by an formatting in the message string
   */
  logInfo(message: string, ...messageArgs: string[]) {
    arguments[0] = Strings.format("<span class='output_text_info'>{0}</span>", message);
    this.printf.apply(this, arguments);
  }

  /**
   * Prints a formated message to the command log as a warning message
   * @param {string} message - The format of the message to be printed to the command log
   * @param {string[]} messageArgs - An array of arguement to be used by an formatting in the message string
   */
  logWarning(message, ...messageArgs: string[]) {
    arguments[0] = Strings.format("<span class='output_text_warning'>[Warning] {0}</span>", message);
    this.printf.apply(this, arguments);
  }

  /**
   * Prints a formated message to the command log as an error message
   * @param {string} message - The format of the message to be printed to the command log
   * @param {string[]} messageArgs - An array of arguements to be used by an formatting in the message string
   */
  logError(message, ...messageArgs: string[]) {
    arguments[0] = Strings.format("<span class='output_text_error'>[Error] {0}</span>", message);
    this.printf.apply(this, arguments);
  }

  /**
   * Returns the map of all registered commands
   * @returns {Map<string, CommandInfo>()} An object containing the command info for each registered command
   */
  getCommandMap() {
    return this.commandMap;
  }

  /**
   * Returns the command history
   * @return {string[]} An array of strings for the complete history of each command that has been executed
   */
  getHistory() {
    return this.commandHistory;
  }

  /**
   * Returns the command log
   * @return {string} The entire command log for the current session
   */
  getLog() {
    return this.commandLog;
  }
}

// The debug command manager
let commandMgr = new CommandManager();
export { commandMgr };