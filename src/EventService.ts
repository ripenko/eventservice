import { clone, pull } from "lodash";

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
    public static on<T>(eventName: string, callback: (eventData?: any, prevSubscriptionResult?: any) => Promise<T>, key: string = null): void {
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
    public static off(eventName: string, key: string | null = null): void {
        EventService.log(`EventService.off("${eventName}", "${key}")`);
        if (!EventService.subscriptions[eventName]) return;
        EventService.subscriptions[eventName] = EventService.subscriptions[eventName].filter(x => x.key !== key);
        EventService.log(`EventService.subscription["${eventName}"]`, EventService.subscriptions[eventName]);
    }

    /**
     * Fire event.
     * Also this method will wait for subscriber callback.
     * @param eventName The name of event
     * @param eventData The data that will be passed to subscriber's callback method
     */
    public static async fire<T>(eventName: string, eventData?: any): Promise<T> {
        EventService.log(`Event '${eventName}' has been executed: ${EventService.subscriptions[eventName] ? EventService.subscriptions[eventName].length : 0}`, eventData);
        if (!EventService.subscriptions[eventName]) return undefined;
        return EventService.fireExecute<T>(clone(EventService.subscriptions[eventName]), eventData);
    }

    public static clear(): void {
        EventService.subscriptions = {};
    }

    private static subscriptions: {
        [name: string]: Array<{
            key: string;
            action: (eventData: any) => Promise<any>;
        }>;
    } = {};

    private static async fireExecute<T>(
        subscriptions: Array<{ key: string; action: (eventData: any) => Promise<T> }>,
        eventData: T): Promise<T> {
        const subscription = subscriptions[0];
        if (!subscription) return undefined;

        const actionResult: T = await subscription.action(eventData);
        if (subscriptions.length <= 1) return actionResult;
        return EventService.fireExecute<T>(pull(subscriptions, subscription), actionResult === undefined ? eventData : actionResult);
    }

    private static log<TMessage, TData>(message: TMessage, data?: TData): void {
        if (console && (console as any).EventServiceDebug) {
            console.log(message, data);
        }
    }

    private constructor() { }
}
