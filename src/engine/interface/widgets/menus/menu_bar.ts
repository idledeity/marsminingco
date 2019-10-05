import { UIWidget } from "../ui_widget.js";

import assert from "../../../../core_libs/system/assert.js";
import * as DOMElements from "../../../../core_libs/utility/dom_element.js";

export class MenuBarItem {
  private displayText: string;
  private callbackHandler: (selectedItem: MenuBarItem) => void;

  private childItems: MenuBarItem[];

  private menuBar: MenuBar;
  private rootElement: HTMLElement;
  private childAttachElement: HTMLElement; 

  constructor(displayText: string, rootElement: HTMLElement, childAttachElement: HTMLElement, callbackHandler: (selectedElement: MenuBarItem) => boolean) {
    this.displayText = displayText;
    this.callbackHandler = callbackHandler;

    this.childItems = [];

    this.menuBar = null;
    this.rootElement = rootElement;
    this.childAttachElement = childAttachElement;
  } 

  addItem(menuBarItem: MenuBarItem) {
    this.childItems.push(menuBarItem);
  }

  attachToMenu(menuBar: MenuBar, rootElement: HTMLElement, childAttachElement: HTMLElement = rootElement) {
    this.menuBar = menuBar;
    this.rootElement = rootElement;
    this.childAttachElement = childAttachElement;
  }

  getAttachElement() {
    return this.childAttachElement;
  }
}

export class MenuBar extends UIWidget {
    private menuRootElement: HTMLElement;
    private topLevelMenuTemplate: HTMLElement;
    private menuItemTemplate: HTMLElement;
    private rootMenuItem: MenuBarItem;

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

      this.rootMenuItem = null;
    }

    /**
     * Handles composing the widget after it's resources have been loaded
     * @returns {boolean} True if the widget was successfully composed, False if there was some error
     */
    protected compose() {
      if (!super.compose()) {
        return false;
      }

      // Locate the root menu element
      this.menuRootElement = DOMElements.findElementByClass(this.getRootElement(), "_menu_bar");
      if (!assert(this.menuRootElement != null, "Failed to locate '_menu_bar' element in {0}.", this.getPathHTML())) {
        return false;
      }

      // Locate the menu dropdown element
      this.topLevelMenuTemplate = DOMElements.findElementByClass(this.getRootElement(), "menu_dropdown");
      if (!assert(this.topLevelMenuTemplate != null, "Failed to located 'menu_dropdown' element in {0}.", this.getPathHTML())) {
        return false;
      }
      this.topLevelMenuTemplate.parentElement.removeChild(this.topLevelMenuTemplate);

      // Locate the item content element
      this.menuItemTemplate = DOMElements.findElementByClass(this.topLevelMenuTemplate, "item_content");
      if (!assert(this.menuItemTemplate != null, "Failed to located 'item_content' element in {0}.", this.getPathHTML())) {
        return false;
      }
      this.menuItemTemplate.parentElement.removeChild(this.menuItemTemplate);

      return true;
    }

    /**
     * Add a new item to the menu bar
     * @param {string} displayText - The text to be displayed
     * @param {function} callbackHandler - Function that is called when the item is selected
     * @param {HTMLElement} parentElement - [Optional] Parent menu bar item 
     */
    addMenuItem(displayText: string, callbackHandler: (selectedElement: MenuBarItem) => boolean, parentElement: MenuBarItem = null) {
      let newItem = null;
      if (parentElement == null) {
        let newElement = (this.topLevelMenuTemplate.cloneNode(true) as HTMLElement);
        DOMElements.findElementByClass(newElement, "dropdown_button").innerText = displayText;


        newItem = new MenuBarItem("whoa", newElement, DOMElements.findElementByClass(newElement, "dropdown_content"), callbackHandler);
        this.menuRootElement.appendChild(newElement);
        newElement.addEventListener("click", function(ev: MouseEvent) {
          if (newItem.callbackHandler())
          {
            ev.stopPropagation();
          }
        });

      } else {
        let newElement = (this.menuItemTemplate.cloneNode(true) as HTMLElement);
        DOMElements.findElementByClass(newElement, "item_button").innerText = displayText;
        let sidebar = DOMElements.findElementByClass(newElement, "sidebar_content");
        let rect = parentElement.getAttachElement().getBoundingClientRect();
        sidebar.style.top = (parentElement.getAttachElement().clientHeight) + 'px';
        newItem = new MenuBarItem("whoa1", newElement, DOMElements.findElementByClass(newElement, "sidebar_content"), callbackHandler);
        parentElement.getAttachElement().appendChild(newElement);
        newElement.addEventListener("click", function(ev: MouseEvent) {
          if (newItem.callbackHandler())
          {
            ev.stopPropagation();
          }
        });

      }

      return newItem;
    }
}