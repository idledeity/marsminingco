(function (MMC, undefined) {
  "use strict";

  // Create a test js object to test the object property viewer 
  var testObject = { property1: 10, property2: "test prop" };
  var propertyViewer = new MMC.Interface.PropertyViewerWidget();
  propertyViewer.displayProperties(testObject);

  // Create the game and start it!
  MMC.theGame = new MMC.Game();
  MMC.theGame.runGame();

}(window.MMC = window.MMC || {}));