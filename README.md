# eventservice

The Promise-based simple event bus service

[![build status](https://secure.travis-ci.org/AlexeyRipenko/eventservice.svg)](http://travis-ci.org/AlexeyRipenko/eventservice)
[![dependency status](https://david-dm.org/AlexeyRipenko/eventservice.svg)](https://david-dm.org/AlexeyRipenko/eventservice)

## Installation

```
npm install --save eventservice
```

## Usage

### Simple usage
```js
import EventService from "eventservice";

// subscribe to event with name "SomeEventName"
EventService.on("SomeEventName", async () => {
    //do something
    console.log("Did something!");
});

// to trigger event.
await EventService.fire("SomeEventName", null);
// -> Did something!
```

### Passing data to the subscriber
```js
import EventService from "eventservice";

// subscribe to event with name "SomeEventName"
EventService.on("SomeEventName", async (date: Date) => {
    console.log(date);
});

// to trigger event. Take a look to the second arg
await EventService.fire("SomeEventName", new Date());
// -> current date
```

### Getting date from the subscriber
Use method `on`.
```js
import EventService from "eventservice";

// subscribe to event with name "SomeEventName"
EventService.on("SomeEventName", async () => {
    return "Hello World!"
});

// to trigger event.
const result: string = await EventService.fire<string>("SomeEventName", null);
console.log(result); // -> Hello World!
```

### Waiting a nested event
```ts
import EventService from "eventservice";

// subscribe to event with name "SomeEventName2"
EventService.on("SomeEventName2", (name: string) => {
    return new Promise<string>((resolve, reject) => {
        setTimeout(() => resolve(`Hello ${name}!`, 5000));
    });
});

// subscribe to event with name "SomeEventName1"
EventService.on("SomeEventName1", async (name: string) => {
    return await EventService.fire<string>("SomeEventName1", name);
});

// to trigger event. Take a look to the latest arg
const result: string = await EventService.fire<string>("SomeEventName1", "World");
console.log(result); // after 5s -> Hello World!
```

### Unsubscribe
You can use method `off`
```ts
import EventService from "eventservice";

// subscribe to event with name "SomeEventName"
EventService.on("SomeEventName", async (name: string) => {
    return `Hello ${name}!`;
}, "SomeKey");

// unsubscribe to event with name "SomeEventName"
EventService.off("SomeEventName", "SomeKey");

// to trigger event. Take a look to the latest arg
const result: string = await EventService.fire<string>("SomeEventName", "World");
console.log(result); // undefined
```

## Credits
[Alexey Ripenko](http://ripenko.ru/), [GitHub](https://github.com/AlexeyRipenko/)

## License

MIT
