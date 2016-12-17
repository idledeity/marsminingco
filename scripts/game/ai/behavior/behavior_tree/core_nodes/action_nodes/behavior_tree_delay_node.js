(function (MMC, undefined) { /* MMC module namespace */
  "use strict";
(function(AI, undefined) { /* AI submodule namespace */
(function(Behavior, undefined) { /* Behavior submodule namespace */

  // BehaviorTreeDelayNode is an action node that simply delays for a certain amount of time
  //
  Behavior.BehaviorTreeDelayNode = class BehaviorTreeDelayNode extends Behavior.BehaviorTreeActionNode {
    // Constructor
    constructor(delayTimeMinMs, delayTimeMaxMs) {
      super();

      // Handle missing arguments
      if (delayTimeMinMs == undefined) {
        delayTimeMinMs = 0.0;
      }
      if (delayTimeMaxMs == undefined) {
        delayTimeMaxMs = delayTimeMinMs;
      }

      // Ensure the min/max values are numbers
      MMC.System.assert(!delayTimeMinMs.isNaN, "delayTimeMinMs must be a number.");
      MMC.System.assert(!delayTimeMaxMs.isNaN, "delayTimeMaxMs must be a number.");

      // Ensure the max value is greater or equal to the min value
      MMC.System.assert((delayTimeMaxMs >= delayTimeMinMs), "delayTimeMaxMs must be greater than delayTimeMinMs.");

      // Store the min and max delay values
      var _delayTimeMinMs = delayTimeMinMs;
      var _delayTimeMaxMs = delayTimeMaxMs;
      var _delayTimeMs = delayTimeMinMs;
      var _elapsedTimeMS = 0.0;

      this.delayTimeMinMs = _delayTimeMinMs;      // Minimum delay time (MS)
      this.delayTimeMaxMs = _delayTimeMaxMs;      // Maximum delay time (MS)
      this.delayTimeMs = _delayTimeMinMs;         // Current random delay time between [min, max) (MS)
      this.elapsedTimeMS = _elapsedTimeMS;  // Elapsed time since the node started processing (MS)  
    }

    // Returns a random delay time based on the min and max values
    getRandomDelayTimeMs() {
      const delta = this.delayTimeMaxMs - this.delayTimeMinMs;
      return this.delayTimeMinMs + (MMC.Math.random() * delta); 
    }

    // Enter function called when this node begins running
    enter() {
      // Call enter on the super class
      super.enter()

      // Calculate how long this node will delay
      this.delayTimeMs = this.getRandomDelayTimeMs();
      this.elapsedTimeMS = 0.0;
    }

    // Exit funcitno called when this node end running
    exit(fromAbort) {
      // Call exit on the super class
      super.exit(fromAbort);
    }

    // Per-frame update function called on this node while it is running. 
    process(deltaMs) {
      // Call process on the super class
      const baseResult = super.process(deltaMs);
      if (baseResult == Behavior.BehaviorTreeNodeResult.FAILURE) {
        return Behavior.BehaviorTreeNodeResult.FAILURE;
      }

      // If the active duration is greater or equal to the delay time, return success      
      if (this.elapsedTimeMS >= this.delayTimeMs) {
        return Behavior.BehaviorTreeNodeResult.SUCCESS;
      }

      // Update the duration this node has been active
      this.elapsedTimeMS += deltaMs;
      return Behavior.BehaviorTreeNodeResult.RUNNING;
    }
  }

}(window.MMC.AI.Behavior = window.MMC.AI.Behavior || {}));
}(window.MMC.AI = window.MMC.AI || {}));
}(window.MMC = window.MMC || {}));