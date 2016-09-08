"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PubSub = function () {
  function PubSub() {
    _classCallCheck(this, PubSub);

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


  _createClass(PubSub, [{
    key: "registerEvent",
    value: function registerEvent(eventName) {
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

  }, {
    key: "muteEvent",
    value: function muteEvent(eventName) {
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

  }, {
    key: "unmuteEvent",
    value: function unmuteEvent(eventName) {
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

  }, {
    key: "subscribe",
    value: function subscribe(eventName, callback) {
      var _this = this;

      var key = this._getKey();
      if (this.events.indexOf(eventName) === -1) {
        throw "The event \"" + eventName + "\" has not been registered.";
      } else {
        this.subscribers[eventName][key] = callback;
      }

      return function () {
        delete _this.subscribers[eventName][key];
      };
    }
  }, {
    key: "_getKey",
    value: function _getKey() {
      return ("0000" + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4);
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

  }, {
    key: "subscribeAll",
    value: function subscribeAll(eventNames, callback) {
      var _this2 = this;

      var tally = eventNames.reduce(prev, function (curr) {
        prev[curr] = 0;
      }, {});

      var wrapped = function wrapped(eventName) {
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
      };

      var key = this._getKey();
      // Need to subscribe the wrapped function to all events and create an
      // unsubscribe function that unsubscribes all of them
      return function () {
        delete _this2.subscribers[eventName][key];
      };
    }
  }]);

  return PubSub;
}();

exports.default = PubSub;
