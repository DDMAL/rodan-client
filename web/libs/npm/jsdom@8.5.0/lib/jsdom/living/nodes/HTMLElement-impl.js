/* */ 
"use strict";
const ElementImpl = require('./Element-impl').implementation;
const MouseEvent = require('../generated/MouseEvent');
class HTMLElementImpl extends ElementImpl {
  constructor(args, privateData) {
    super(args, privateData);
    this._tabIndex = 0;
    this._settingCssText = false;
    this._clickInProgress = false;
    this._style = new this._core.CSSStyleDeclaration((newCssText) => {
      if (!this._settingCssText) {
        this._settingCssText = true;
        this.setAttribute("style", newCssText);
        this._settingCssText = false;
      }
    });
  }
  dispatchEvent(event) {
    const outcome = super.dispatchEvent(event);
    if (event.type === "click") {
      callEventBehaviorHook(event, "_preClickActivationSteps");
      if (event.defaultPrevented) {
        callEventBehaviorHook(event, "_canceledActivationSteps");
      } else {
        callEventBehaviorHook(event, "_activationBehavior");
      }
    }
    return outcome;
  }
  focus() {
    this._ownerDocument._lastFocusedElement = this;
  }
  blur() {
    this._ownerDocument._lastFocusedElement = null;
  }
  click() {
    if (this._clickInProgress) {
      return;
    }
    this._clickInProgress = true;
    if (this.hasAttribute("disabled")) {
      return;
    }
    const event = MouseEvent.createImpl(["click", {
      bubbles: true,
      cancelable: true
    }], {});
    this.dispatchEvent(event);
    this._clickInProgress = false;
  }
  get style() {
    return this._style;
  }
  set style(value) {
    this._style.cssText = value;
  }
  _attrModified(name, value, oldValue) {
    if (name === "style" && value !== oldValue && !this._settingCssText) {
      this._settingCssText = true;
      this._style.cssText = value;
      this._settingCssText = false;
    }
    super._attrModified.apply(this, arguments);
  }
  get tabIndex() {
    if (!this.hasAttribute("tabindex")) {
      return -1;
    }
    return parseInt(this.getAttribute("tabindex"));
  }
  set tabIndex(value) {
    this.setAttribute("tabIndex", String(value));
  }
}
function callEventBehaviorHook(event, name) {
  if (event && event.target && typeof event.target[name] === "function") {
    event.target[name](event);
  }
}
module.exports = {implementation: HTMLElementImpl};
