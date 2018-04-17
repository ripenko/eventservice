import { clone, pull, remove, toUpper } from "lodash";

export declare var environment: {
    isDev: boolean;
    isProd: boolean;
};

export default class EventService {

    /**
     * Subscribe to event
     * @param eventName The name of event
     * @param callback The function callback that will be invoked when event will be fired
     * @param key The optional param. The key of subscription. Used to identify the subscription for method `off`
     */
    public static on<T>(eventName: string, callback: (eventData?: any) => Promise<T>, key: string = null): void {
        if (!EventService.subscriptions[eventName]) EventService.subscriptions[eventName] = [];
        EventService.subscriptions[eventName].push({
            key: key,
            action: callback
        });
    }

    /**
     * Unsubscribe from event
     * @param eventName The name of event
     * @param key The key that identify subscription. Use certain key that has been given in method `on`
     */
    public static off(eventName: string, key: string): void {
        if (!EventService.subscriptions[eventName]) return;
        key = toUpper(key);
        remove(EventService.subscriptions[eventName], (subscription) => {
            return key === toUpper(subscription.key);
        });
    }

    /**
     * Fire event
     * @param eventName The name of event
     * @param eventData The data that will be passed to subscriber's callback method
     * @param waitCurrent If the subscriber returns an `Promise` and if `waitCurrent` is true then it will wait for executing of returned `Promise`.
     */
    public static async fire<T>(eventName: string, eventData: any, waitCurrent?: boolean): Promise<T> {
        if (environment && environment.isDev) {
            console.log(`${waitCurrent ? "[WAIT] " : ""}Event '${eventName}' has been executed: ${EventService.subscriptions[eventName] ? EventService.subscriptions[eventName].length : 0}`, eventData);
        }
        if (!EventService.subscriptions[eventName]) return undefined;
        if (waitCurrent) {
            return new Promise<T>(resolve => {
                EventService.firesQueue.push(async () => {
                    const result = await EventService.fireExecute<T>(clone(EventService.subscriptions[eventName]), eventData);
                    resolve(result);
                });

                if (!EventService.queueInExecution) {
                    EventService.queueInExecution = true;

                    const queueExec = async (fireItem: () => Promise<T>): Promise<void> => {
                        await fireItem();
                        if (EventService.firesQueue.length === 0) {
                            EventService.queueInExecution = false;
                            return;
                        }
                        await queueExec(EventService.firesQueue.shift());
                    };

                    queueExec(EventService.firesQueue.shift());
                }
            });
        }

        return await EventService.fireExecute<T>(clone(EventService.subscriptions[eventName]), eventData);
    }

    private static subscriptions: {
        [name: string]: Array<{
            key: string;
            action: (eventData: any) => Promise<any>
        }>;
    } = {};

    private static firesQueue: Array<() => Promise<any>> = [];
    private static queueInExecution: boolean = false;

    private static async fireExecute<T>(
        subscriptions: Array<{ key: string; action: (eventData: T) => Promise<T> }>,
        eventData: T): Promise<T> {
        const subscription = subscriptions[0];
        if (!subscription) return undefined;

        const actionResult: T = await subscription.action(eventData);
        if (typeof actionResult !== "undefined") return actionResult;
        if (subscriptions.length === 0) return undefined;

        return await EventService.fireExecute<T>(pull(subscriptions, subscription), eventData);
    }

    private constructor() { }
}
