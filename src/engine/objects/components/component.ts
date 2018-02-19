(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Objects, undefined) { /* Objects submodule namespace */

  /**
   * Game entity component class is used to build modular entity functionality
   */
  JJ.BE.Objects.Component = class Component {
    /**
     * Constructor
     * @param {JJ.BE.Objects.Entity} parentEntity - Parent entity this component belongs to
     */
    constructor(parentEntity) {
      var _parentEntity = null;
      this.parentEntity = _parentEntity;    // Reference to the parent entity object that owns this component

      setParentEntity(parentEntity);
    }

    /**
     * Per frame update
     * @param {Number} deltaMs - The elapsed time since the last update, in milliseconds
     */
    update(deltaMs) {
      // Nothing to do
    }

    /**
     * Sets the parent entity that 'owns' this component
     * @param {JJ.BE.Objects.Entity} parentEntity - The parent entity that is gaining ownership of this component
     */
    setParentEntity(parentEntity) {
      this.parentEntity = parentEntity;
    }
  }

}(window.JJ.BE.Objects = window.JJ.BE.Objects || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));