# eventservice

A simple Promise-based event bus service.

[![npm version](https://img.shields.io/npm/v/eventservice)](https://www.npmjs.com/package/eventservice)

## Installation

```bash
npm install eventservice
```

## Usage

### Basic usage

```ts
import EventService from "eventservice";

// Subscribe to an event named "SomeEventName"
EventService.on("SomeEventName", async () => {
  console.log("Did something!");
});

// Trigger the event
await EventService.fire("SomeEventName");
// -> Did something!
```

### Passing data to a subscriber

```ts
import EventService from "eventservice";

// Subscribe to an event named "SomeEventName"
EventService.on("SomeEventName", async (date: Date) => {
  console.log(date);
});

// Trigger the event
await EventService.fire("SomeEventName", new Date());
// -> current date
```

### Getting a result

```ts
import EventService from "eventservice";

// Subscribe to an event named "SomeEventName"
EventService.on("SomeEventName", async () => {
  return "Hello World!";
});

// Trigger the event
const result: string | undefined = await EventService.fire<string>("SomeEventName");
console.log(result); // -> Hello World!
```

### Waiting for a nested event

```ts
import EventService from "eventservice";

// Subscribe to an event named "SomeEventName2"
EventService.on("SomeEventName2", (name: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => resolve(`Hello ${name}!`), 5000);
  });
});

// Subscribe to an event named "SomeEventName1"
EventService.on("SomeEventName1", async (name: string) => {
  return await EventService.fire<string>("SomeEventName2", name);
});

// Trigger the event
const result: string | undefined = await EventService.fire<string>("SomeEventName1", "World");
console.log(result); // after 5s -> Hello World!
```

### Unsubscribing

You can use the `off` method.

```ts
import EventService from "eventservice";

// Subscribe to an event named "SomeEventName"
EventService.on(
  "SomeEventName",
  async (name: string) => {
    return `Hello ${name}!`;
  },
  "SomeKey",
);

// Unsubscribe from the event
EventService.off("SomeEventName", "SomeKey");

// Trigger the event
const result: string | undefined = await EventService.fire<string>("SomeEventName", "World");
console.log(result); // -> undefined
```

## API

### `EventService.on(eventName, callback, key?)`

Subscribes to an event.

- `eventName` — event name
- `callback` — async callback that will be called when the event is fired
- `key` — optional subscription key used for unsubscribing

### `EventService.off(eventName, key?)`

Unsubscribes from an event by key.

### `EventService.fire(eventName, eventData?)`

Fires an event and waits until all subscribers finish.

### `EventService.clear()`

Removes all subscriptions.

## Credits

[Alexey Ripenko](http://ripenko.ru/), [GitHub](https://github.com/ripenko/)

## License

MIT
