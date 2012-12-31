var test = require('tap').test;
var boxedEmitter = require('../');
var EventEmitter = require('events').EventEmitter;

test('creates an emitter', function(t) {
  t.plan(2);

  var emitter = boxedEmitter();
  t.ok(!! emitter.on);
  t.ok(!! emitter.emit);
});

test('wraps an emitter', function(t) {
  t.plan(3);

  var ee = new EventEmitter();  
  var emitter = boxedEmitter(ee);
  t.ok(!! emitter.on);
  t.ok(!! emitter.emit);
  t.ok(!! emitter.box)
});

test('creates a box which wraps emit', function(t) {

  t.plan(3);

  var emitter = boxedEmitter();
  var box = emitter.box('box');
  emitter.on('box::event', function(a, b, c) {
    t.deepEqual(a, 'abc');
    t.deepEqual(b, 'def');
    t.deepEqual(c, undefined);
  });

  box.emit('event', 'abc', 'def');
});

test('creates a box which wraps addListener', function(t) {

  t.plan(3);

  var emitter = boxedEmitter();
  var box = emitter.box('box');
  box.on('event', function(a, b, c) {
    t.deepEqual(a, 'abc');
    t.deepEqual(b, 'def');
    t.deepEqual(c, undefined);
  });

  box.emit('event', 'abc', 'def');
});

test('creates a box which wraps removeListener', function(t) {

  t.plan(1);

  var emitter = boxedEmitter();
  var box = emitter.box('box');

  function listener(a, b, c) {
    throw new Error('should not reach here!');
  }

  box.on('event', listener);
  box.off('event', listener);

  box.emit('event', 'abc', 'def');
  t.ok(true);
});

test('creates a box which wraps removeAllListeners', function(t) {

  t.plan(1);
  var emitter = boxedEmitter();
  var box = emitter.box('box');

  function listener(a, b, c) {
    throw new Error('should not reach here!');
  }

  box.on('event', listener);
  box.removeAllListeners('event');

  box.emit('event', 'abc', 'def');
  t.ok(true);
});

test('creates a box inside another box', function(t) {
  t.plan(3);

  var emitter = boxedEmitter();
  var bigBox = emitter.box('bigbox');
  var smallBox = bigBox.box('smallbox');
  
  bigBox.on('smallbox::event', function(a, b, c) {
    t.equal(a, 'abc');
    t.equal(b, 'def');
    t.equal(c, undefined);
  });
  
  smallBox.emit('event', 'abc', 'def');
});

test('creates a box that emits wildcard events', function(t) {
  t.plan(2);

  var emitter = boxedEmitter();
  var box = emitter.box('box');
  
  box.wildcard(true);
  
  box.on('*', function(eventType, arguments) {
    t.equal(eventType, 'event');
    t.deepEqual(arguments, ['abc', 'def']);
  });
  
  box.emit('event', 'abc', 'def');
});