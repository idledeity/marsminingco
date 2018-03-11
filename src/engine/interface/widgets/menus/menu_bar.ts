import { UIWidget } from "../ui_widget.js";

import assert from "../../../../core_libs/system/assert.js";
import * as DOMElements from "../../../../core_libs/utility/dom_element.js";

export class MenuBarItem {
  constructor(element: HTMLElement, childAttachElement: HTMLElement = element, callback: (selectedItem: MenuBarItem) => void) {
  }
}

export class MenuBar extends UIWidget {
    private menuRootElement: HTMLElement;
    private topLevelMenuTemplate: HTMLElement;
    private menuItemTemplate: HTMLElement; 

    /**
     * Constructor
     * @param {HTMLElement} parentElement - The parent DOM element this widget is a child of
     * @param {string} htmlPath - Path to the HTML document for this widget
     * @param {string} cssPath - Path to the CSS document for this widget
     */
    constructor(parentElement: HTMLElement = null,
                htmlPath: string = "data/engine/interface/widgets/menus/menu_bar.html", 
                cssPath: string = "data/engine/interface/widgets/menus/menu_bar.css") {
      super(htmlPath, cssPath, parentElement);
    }

    protected compose() {
      if (!super.compose()) {
        return false;
      }

      this.menuRootElement = DOMElements.findElementByClass(this.getRootElement(), "_menu_bar");

      this.topLevelMenuTemplate = DOMElements.findElementByClass(this.getRootElement(), "menu_dropdown");
      if (assert(this.topLevelMenuTemplate != null, "Failed to located 'menu_dropdown' element in {0}.", this.getPathHTML())) {
        this.topLevelMenuTemplate.parentElement.removeChild(this.topLevelMenuTemplate);
      }

      this.menuItemTemplate = DOMElements.findElementByClass(this.topLevelMenuTemplate, "dropdown_item");
      if (assert(this.menuItemTemplate != null, "Failed to located 'dropdown_item' element in {0}.", this.getPathHTML())) {
        this.menuItemTemplate.parentElement.removeChild(this.menuItemTemplate);
      }

      return true;
    }

    addMenuItem(displayText: string, callbackHandler: (selectedElement: MenuBarItem) => void, parentElement: MenuBarItem = null) {
      let newItem = null;
      if (parentElement == null) {
        let newElement = (this.topLevelMenuTemplate.cloneNode(true) as HTMLElement);
        DOMElements.findElementByClass(newElement, "drowpdown_button").innerText = displayText;
        newItem = new MenuBarItem(newElement, DOMElements.findElementByClass(newElement, "dropdown_content"), callbackHandler);
        this.menuRootElement.appendChild(newElement);
      }

      return newItem;
    }
}