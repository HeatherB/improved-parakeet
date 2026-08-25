/**
 * Tooltip
 *
 * @description
 * Toggle an open class to display context menu on click (Mods and Clans gear icon)
 * The animation magic happens in CSS (styles/components/_tooltip-menu.scss)
 */

export default class Tooltip {
  constructor(objOptions) {
    this.init(objOptions);
  }

  init(objOptions) {
    this.options = Object.assign({
      selectorContainer  : '.tooltip-menu',                        // selector for container
      selectorTrigger    : '.tooltip-menu__trigger',               // selector for open/close toggle
      selectorLabelOpen  : '.tooltip-menu__trigger-label--open',   // selector for offscreen open menu label
      selectorLabelClose : '.tooltip-menu__trigger-label--close',  // selector for offscreen close menu label
      classOpen          : 'is-open',
    }, objOptions);

    this.ui = {
      container        : null,
      curContainer     : null,
      trigger          : null,
      labelOpen        : null,
      labelClose       : null,
    };

    this._initLayout();
    this._addEventListeners();
  }

  kill() {
    this._removeEventListeners();
  }

  closeAll() {
    this.ui.container.removeClass(this.options.classOpen);
  }

  closeCurrent() {
    this.ui.curContainer.removeClass(this.options.classOpen);
  }

  _initLayout() {
    this.ui.container  = $(this.options.selectorContainer);
    this.ui.trigger    = this.ui.container.find(this.options.selectorTrigger);
    this.ui.labelOpen  = this.ui.container.find(this.options.selectorLabelOpen);
    this.ui.labelClose = this.ui.container.find(this.options.selectorLabelClose);
  }

  _onTriggerClick(e) {
    e.preventDefault();
    this.ui.curContainer = $(e.currentTarget).parents(this.options.selectorContainer);

    if (!this.ui.curContainer.hasClass(this.options.classOpen)) {
      this.closeAll();
      this.ui.curContainer.addClass(this.options.classOpen);
    } else {
      this.ui.curContainer.removeClass(this.options.classOpen);
    }
  }

  _removeEventListeners() {
    this.ui.container.off('click');
  }

  _addEventListeners() {
    this.ui.container.on('click', this.options.selectorTrigger, this._onTriggerClick.bind(this));
  }
}
