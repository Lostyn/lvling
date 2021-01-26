import HYPEventEmitter from "./HYPEventEmitter";

export const InteractionTypes = {
  MOVE: "MOVE", //mousemove
  TOUCH: "TOUCH", //mousedown
  DROP: "DROP", //mouseup
};

export const WindowEventTypes = {
  WHEEL: "WHEEL",
  RESIZE: "RESIZE",
};

//Listen to main window event by avoiding to have multiple addEventListeners
class HYPWindow extends HYPEventEmitter {
  constructor() {
    super();
    window.addEventListener("mousemove", this._onMouseMove.bind(this));
    window.addEventListener("mouseup", this._onMouseUp.bind(this));
    window.addEventListener("mousedown", this._onMouseDown.bind(this));
    window.addEventListener("wheel", this._onWheel.bind(this));
    window.addEventListener("resize", this._onResize.bind(this));
  }

  _onMouseMove(e) {
    this.emit(InteractionTypes.MOVE, e);
  }

  _onMouseUp(e) {
    this.emit(InteractionTypes.DROP, e);
  }

  _onMouseDown(e) {
    this.emit(InteractionTypes.TOUCH, e);
  }

  _onWheel(e) {
    this.emit(WindowEventTypes.WHEEL, e);
  }

  _onResize(e) {
    this.emit(WindowEventTypes.RESIZE, e);
  }
}

export default new HYPWindow();
