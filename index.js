var EventEmitter = require('events').EventEmitter;

function box(boxName) {
  var box = new EventEmitter();
  var emitter = this;
  var wildcard = false;
  var boxPrefix = boxName + '::';
  
  box.emit =
  function boxedEmit(eventName) {
    var originalEventName = eventName;
    eventName = boxPrefix + eventName;
    var returning = emitter.emit.apply(emitter, arguments);
    if (wildcard) {
      var args = Array.prototype.slice.call(arguments, 1);
      emitter.emit(boxPrefix + '*', originalEventName, args);
    }
    return returning;
  };

  box.addListener =
  box.on =
  function addListener(eventType, callback) {
    return emitter.addListener(boxPrefix + eventType, callback);
  };

  box.removeListener =
  box.off =
  function removeListener(eventType, callback) {
    return emitter.removeListener(boxPrefix + eventType, callback);
  };

  box.removeAllListeners =
  function removeAllListeners(eventType) {
    return emitter.removeAllListeners(boxPrefix + eventType);
  };

  box.wildcard =
  function (_wildcard) {
    wildcard = _wildcard;
  }

  return wrap(box);
}

function wrap(emitter) {
  emitter.box = box;
  return emitter;
}

function createOrWrap(emitter) {
  if (! emitter) emitter = new EventEmitter();
  return wrap(emitter);
}

module.exports = createOrWrap;