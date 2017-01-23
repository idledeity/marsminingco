(function (JJ, undefined) { /* JJ module namespace */
  "use strict";
(function (BE, undefined) { /* BE (Brood Engine) namespace */
(function(Interface, undefined) { /* Interface submodule namespace */
(function(Panes, undefined) { /* Interface submodule namespace */

  // Console pane for debug commands and output
  //
  Panes.Console = class Console extends Interface.UIPane {
    constructor(parentElement) {
      super(parentElement, "data/engine/interface/console/console.html", "data/engine/interface/console/console.css");

      this.createHidden = true;

      this.outputTextElement = null;
      this.inputTextElement = null;
    }
  }


}(window.JJ.BE.Interface.Panes = window.JJ.BE.Interface.Panes || {}));
}(window.JJ.BE.Interface = window.JJ.BE.Interface || {}));
}(window.JJ.BE = window.JJ.BE || {}));
}(window.JJ = window.JJ || {}));