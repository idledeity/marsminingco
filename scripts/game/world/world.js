(function (MMC, undefined) { /* MMC module namespace */
  "use strict";

  // The MMC world object manages the game's world and all the entities contained within it.
  MMC.World = class World {
    constructor() {
      this.worldTimePrev = 0.0;
      this.worldTime = 0.0;

      this.entities = []; 
    }

    getWorldTime() {
      return this.worldTime;
    }

    getWorldTimePrev() {
      return this.worldTimePrev;
    }

    // Per frame processing for the game world
    update(deltaMs) {
      // Update the world time
      this.worldTimePrev = this.worldTime;
      this.worldTime += deltaMs;

      // Update all of entities in the world
      for (let entity in this.entities) {
        entity.update(deltaMs);
      }
    }

    // Returns the number of entities in the world
    getEntityCount() {
      return this.entities.length;
    }

    // Returns the entity at the specified index
    getEntityByIndex(index) {
      return this.entities[index];
    }

    // Adds an entity to the world
    addEntity(entity) {
      // Push the new entity onto the end of the entities array
      this.entities.push(entity);
    }
  }

}(window.MMC = window.MMC || {}));