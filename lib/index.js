class PubSub { 
  constructor() {
    this.subscribers = {};
    this.events = [];
    this.muted = [];
  }

  /**
   * Add a new subscibable event.
   * 
   * @param string eventName
   *   The event to be registered.
   */
  registerEvent(eventName) {
    if (this.events.indexOf(eventName) === -1) {
      this.events.push(eventName);
    }
  }

  /**
   * Mutes all subscriptions for the given event.
   *
   * @param string eventName
   *   The event to mute.
   */
  muteEvent(eventName) {
    if (this.muted.indexOf(eventName) === -1) {
      this.muted.push(eventName);
    }
  }

  /**
   * Unmutes all subscriptions for the given event.
   *
   * @param string eventName
   *   The event to unmute.
   */
  unmuteEvent(eventName) {
    this.muted = this.muted.filter(eventName);
  }

  /**
   * Subscribes a callback to an event.
   *
   * @param string eventName
   *   The event to which the callback should be subscribed.
   * @param function callback
   *   The callback that should be called.
   *
   * @return function
   *   A function which whill unsubscribe the current subscription.
   */
  subscribe(eventName, callback) {
    const key = this._getKey();
    if (this.events.indexOf(eventName) === -1) {
      throw "The event \"" + eventName + "\" has not been registered.";
    } else {
      this.subscribers[eventName][key] = callback;
    }

    return () => { delete this.subscribers[eventName][key]; }
  }

  _getKey() {
    return ("0000" + (Math.random()*Math.pow(36,4) << 0).toString(36)).slice(-4)
  }

  /**
   * Subscribes a callback to an an array of events.
   *
   * The callback will not be fired until all events have been fired at least
   * once.
   *
   * @param array eventNames
   *   The events to which the callback should be subscribed.
   * @param function callback
   *   The callback that should be called.
   *
   * @return function
   *   A function which whill unsubscribe the current subscription.
   */
  subscribeAll(eventNames, callback) {
    let tally = eventNames.reduce(prev, curr => {
      prev[curr] = 0;
    }, {});

    let wrapped = function (eventName) {
      tally[eventName]++;
      for (var prop in tally) {
        if (tally.hasOwnProperty(prop)) {
          if (tally[prop] === 0) return;
        }
      }
      callback.apply(callback, arguments);
      for (var prop in tally) {
        if (tally.hasOwnProperty(prop)) {
          tally[prop] = 0;
        }
      }
    }

    const key = this._getKey();
    // Need to subscribe the wrapped function to all events and create an
    // unsubscribe function that unsubscribes all of them
    return () => { delete this.subscribers[eventName][key]; }
  }
}

export default PubSub;
