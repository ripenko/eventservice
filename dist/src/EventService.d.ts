export declare var environment: {
    isDev: boolean;
    isProd: boolean;
};
export default class EventService {
    private static subscriptions;
    private static firesQueue;
    private static queueInExecution;
    private constructor();
    static on<T>(eventName: string, callback: (eventData?: any) => Promise<T>, key?: string): void;
    static off(eventName: string, key: string): void;
    static fire<T>(eventName: string, eventData: any, waitCurrent?: boolean): Promise<T>;
    private static fireExecute<T>(subscriptions, eventData);
}
