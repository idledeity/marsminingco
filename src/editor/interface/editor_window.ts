import UIPane from "../../engine/interface/panes/ui_pane.js";
import { MenuBar, MenuBarItem } from "../../engine/interface/widgets/menus/menu_bar.js";
import * as DOMElements from "../../core_libs/utility/dom_element.js";

export default class EditorWindow extends UIPane {
  private menuBar: MenuBar;

  /**
   * Constructor
   * @param {HTMLElement} parentElement - The parent DOM element this pane is a child of
   */
  constructor(parentElement: HTMLElement) {
    super("data/editor/interface/editor_window.html", "data/editor/interface/editor_window.css", parentElement);

    this.menuBar = new MenuBar();
    this.addWidget(this.menuBar);
  }

  /**
   * Called when the pane is initialized after its resources have loaded
   */
  protected compose() {
    // Call the super
    if (!super.compose()) {
      return false;
    }

    this.menuBar.setParentElement(DOMElements.findElementByID(this.getRootElement(), "editor_menu"));

    let menu1 = this.menuBar.addMenuItem("First Menu This One Is Long", function(selectedItem: MenuBarItem) {
      console.log("thing1 was clicked.");
      return true;
    });
    let menu2 = this.menuBar.addMenuItem("Another Menu that is long", function(selectedItem: MenuBarItem) {
      console.log("thing2 was clicked.");
      return true;
    });
    this.menuBar.addMenuItem("Sub Menu 1!", function(selectedItem: MenuBarItem) {
      console.log("Sub menu clicked 1.");
      return true;
    }, menu2);
    let subMenu2 = this.menuBar.addMenuItem("Sub Menu 2! Let's Make this long! Even longer", function(selectedItem: MenuBarItem) {
      console.log("Sub menu clicked 2.");
      return true;
    }, menu2);
    let subMenu3 = this.menuBar.addMenuItem("Sub Menu 3!", function(selectedItem: MenuBarItem) {
      console.log("Sub menu clicked 3.");
      return true;
    }, menu2);
    let sidebar1 = this.menuBar.addMenuItem("Side Bar 1!", function(selectedItem: MenuBarItem) {
      console.log("Side Bar 1 clicked.");
      return true;
    }, subMenu2);
    this.menuBar.addMenuItem("Side Bar 2!", function(selectedItem: MenuBarItem) {
      console.log("Side Bar 2 clicked.");
      return true;
    }, subMenu2);
    let sidebar3 = this.menuBar.addMenuItem("Side Bar 3!", function(selectedItem: MenuBarItem) {
      console.log("Side Bar 3 clicked.");
      return true;
    }, subMenu2);
    let sidebar4 = this.menuBar.addMenuItem("Side Bar 4!", function(selectedItem: MenuBarItem) {
      console.log("Side Bar 4 clicked.");
      return true;
    }, subMenu2);
    this.menuBar.addMenuItem("Side side bar 1", function(selectedItem: MenuBarItem) {
      console.log("side side bar 1");
      return true;
    }, sidebar1);
    this.menuBar.addMenuItem("Side Bar 5! Make this one longer", function(selectedItem: MenuBarItem) {
      console.log("Side Bar 5 clicked.");
      return true;
    }, subMenu2);
    let menu3 = this.menuBar.addMenuItem("Third", function(selectedItem: MenuBarItem) {
      console.log("thing3 was clicked.");
      return true;
    });

    return true;
  }

  /**
   * Main update for per frame processing
   * @param {number} deltaMs - Elapsed time since the last time update was called, in milliseconds
   */
  update(deltaMs: number) {
    super.update(deltaMs);
  }

  /**
   * Called when the pane is destroyed
   */
  destroy() {
    // Call the super
    super.destroy();
  }

  /**
   * Called to show the editor (make it visible)
   */
  show() {
    // Call the super
    super.show();
  }

  navClicked(event: MouseEvent) {
    console.log("click received");
  }

  dropdownClicked(event: MouseEvent) {
    console.log("dropdown clicked: " + event);
  }
}