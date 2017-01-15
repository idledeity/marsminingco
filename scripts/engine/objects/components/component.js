(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Objects, undefined) { /* Objects submodule namespace */

  // Game entity component class is used to build modular entity functionality
  Objects.Component = class Component {
    constructor(parentEntity) {
      var _parentEntity = null;

      this.parentEntity = _parentEntity;    // Reference to the parent entity object that owns this component

      setParentEntity(parentEntity);
    }

    // Per frame update
    update(deltaMs) {

    }

    // Sets the parent entity that 'owns' this component
    setParentEntity(parentEntity) {
      this.parentEntity = parentEntity;
    }
  }

}(window.JJ.BE.Objects = window.JJ.BE.Objects || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));