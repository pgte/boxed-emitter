# boxed-emitter

Scoped events.

## Install

```bash
$ npm install boxed-emitter
```

## Require

```javascript
var boxedEmitter = require('boxed-emitter');
```

## Create a boxed emitter

```javascript
var emitter = boxedEmitter();
```

## Wrap an existing event emitter

```javascript
var EE = require('events').EventEmitter;
var ee = new EE();
var emitter = boxedEmitter(ee);
```

## You can create an event box

and give it a name:

```javascript
var box = emitter.box('box-name');
```

## And use that event box to emit scoped events:

```javascript
// the following emits box-name::event

box.emit('event', 'arg1', 'arg2');  

// which you can listen to
box.on('event', function(a, b) {
  assert.equal(a, 'arg1');
  assert.equal(b, 'arg2');
});
```

## You can create a smaller box inside a box:

```javascript
var emitter = boxedEmitter();
var bigBox = emitter.box('bigbox');
var smallBox = bigBox.box('smallbox');

bigBox.on('smallbox::event', function(a, b, c) {
  t.equal(a, 'abc');
  t.equal(b, 'def');
  t.equal(c, undefined);
});

smallBox.emit('event', 'abc', 'def');
```

## You can listen to wildcard events:

```javascript
// first you have to enable wildcards for this:
box.wildcard(true);

box.on('*', function(eventType, eventArgs) {
  assert.equal(eventType, 'event');
  assert.deepEqual(eventArgs, ['abc', 'def']);
});

box.emit('event', 'abc', 'def');
```

----

And, as a regular event emitter:

## You can also remove listeners:

```javascript
box.off(eventType, listener);
box.removeListener(eventType, listener);
```

## And remove all listeners:

```javascript
box.removeAllListeners(eventType);
```

