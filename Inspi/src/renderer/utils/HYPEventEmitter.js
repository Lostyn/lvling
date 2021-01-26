//basic event emitter class to emit and listen for events
export default class HYPEventEmitter {
  constructor() {
    this._events = {};
    //dictionnary of all the registred events
  }

  //emit a specific event with data
  emit(eventName, data) {
    if (this._events[eventName]) {
      for (let i = this._events[eventName].length - 1; i >= 0; i--) {
        const callback = this._events[eventName][i].callback;
        callback(data);
      }
    }
  }

  //listen for an event, specify a callback and an identifier to stop it later
  on(eventName, callback, identifier = null) {
    if (!identifier) {
      console.error("You must provide an identifier to listen to an event");
      return;
    }
    if (!this._events[eventName]) {
      this._events[eventName] = [];
    }
    this._events[eventName].push({ callback, identifier });
  }

  //stop listening for an event type using the identifier
  off(eventName, identifier = null) {
    if (!identifier) {
      console.error(
        "You must provide an identifier to stop listening to an event"
      );
      return;
    }
    const index = this._events[eventName].findIndex(
      (event) => event.identifier === identifier
    );

    if (~index) {
      this._events[eventName].splice(index, 1);
    }
  }

  //stop all events
  stop() {
    this._events = {};
  }
}
