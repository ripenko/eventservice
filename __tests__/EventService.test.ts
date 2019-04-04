import EventService from "../src/EventService";

it("on => fire", async () => {
    (console as any).EventServiceDebug = true;
    EventService.on("1", async (name: string) => {
        return `Hello ${name}!`;
    });
    
    const result: string = await EventService.fire<string>("1", "World");
    expect(result).toEqual("Hello World!");
    
    EventService.off("1");
    (console as any).EventServiceDebug = false;
});

it("on with throwing an exception => fire", async () => {
    EventService.on("1", async () => {
        throw new Error("Some Error");
    });

    await expect(EventService.fire("1", "World")).rejects.toThrow(Error);
    EventService.off("1");
});

it("on => fire => off => fire", async () => {
    EventService.on("1", async (name: string) => `Hello ${name}!`, "key");

    const result: string = await EventService.fire<string>("1", "World");
    expect(result).toEqual("Hello World!");

    EventService.off("1", "key");

    expect((EventService as any).subscriptions["1"].length).toEqual(0);

    const anotherResult: string | undefined = await EventService.fire<string>("1", "World");
    console.info(anotherResult);
    expect(anotherResult).toBeUndefined();
});

it("nested subscriptions. on => on => fire", async () => {
    EventService.on("2", async () => "Hello");

    EventService.on("1", async (name: string) => {
        const phrase: string = await EventService.fire<string>("2");
        return `${phrase} ${name}!`;
    });

    const result: string = await EventService.fire<string>("1", "John");
    expect(result).toEqual("Hello John!");

    EventService.off("2");
    EventService.off("1");
});

it("two subscriptions with the same name. on => on => => fire", async () => {
    EventService.on("97", async (name: string) => {
        `Hello ${name}`;
    });

    EventService.on("97", async (name: string) => {
        return `${name}!`;
    });

    const result: string = await EventService.fire<string>("97", "Alex");
    expect(result).toEqual("Alex!");
    EventService.off("97");
});

it("two nested subscriptions with the same name. on => on => => fire", async () => {
    EventService.on("987", async (name: string) => {
        return `Hello ${name}`;
    });

    EventService.on("987", async (name: string) => {
        return `${name}!`;
    });

    const result: string = await EventService.fire<string>("987", "Mack");
    expect(result).toEqual("Hello Mack!");
    EventService.off("987");
});

it("fire with no subscriptions", async () => {
    const result = await EventService.fire("123");
    expect(result).toBeUndefined();
});

it("off without subscriptions", () => {
    EventService.off("1234");
});

it("clear", async () => {
    EventService.on("2", async () => "Hello");

    EventService.on("1", async (name: string) => {
        const phrase: string = await EventService.fire<string>("2");
        return `${phrase} ${name}!`;
    });

    const result: string = await EventService.fire<string>("1", "John");
    expect(result).toEqual("Hello John!");

    EventService.clear();
    expect((EventService as any).subscriptions["1"]).toBeUndefined();
    expect((EventService as any).subscriptions["2"]).toBeUndefined();

    const anotherResult: string = await EventService.fire<string>("1", "John");
    expect(anotherResult).toBeUndefined();
});