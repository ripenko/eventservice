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
    static on<T>(eventName: string, callback: (eventData?: any, prevSubscriptionResult?: any) => Promise<T>, key?: string): void;
    /**
     * Unsubscribe from event
     * @param eventName The name of event
     * @param key The key that identify subscription. Use certain key that has been given in method `on`
     */
    static off(eventName: string, key?: string | null): void;
    /**
     * Fire event.
     * Also this method will wait for subscriber callback.
     * @param eventName The name of event
     * @param eventData The data that will be passed to subscriber's callback method
     */
    static fire<T>(eventName: string, eventData?: any): Promise<T>;
    static clear(): void;
    private static subscriptions;
    private static fireExecute;
    private static log;
    private constructor();
}
