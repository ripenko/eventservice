import * as _ from "lodash";

declare var environment: {
    isDev: boolean;
    isProd: boolean;
};

export default class EventService {

    private static subscriptions: {
        [name: string]: {
            key: string;
            action: (eventData: any) => Promise<any>
        }[]
    } = {};

    private static firesQueue: (() => Promise<any>)[] = [];
    private static queueInExecution: boolean = false;

    private constructor() { }

    public static on<T>(eventName: string, callback: (eventData?: any) => Promise<T>, key: string = null): void {
        if (!EventService.subscriptions[eventName]) EventService.subscriptions[eventName] = [];
        EventService.subscriptions[eventName].push({
            key: key,
            action: callback
        });
    };

    public static off(eventName: string, key: string): void {
        if (!EventService.subscriptions[eventName]) return;
        key = _.toUpper(key);
        _.remove(EventService.subscriptions[eventName], (subscription) => {
            return key === _.toUpper(subscription.key);
        });
    }

    public static async fire<T>(eventName: string, eventData: any, waitCurrent?: boolean): Promise<T> {
        if (environment.isDev) {
            console.log(`${waitCurrent ? "[WAIT] " : ""}Event '${eventName}' has been executed: ${EventService.subscriptions[eventName] ? EventService.subscriptions[eventName].length : 0}`, eventData);
        }
        if (!EventService.subscriptions[eventName]) return undefined;
        if (waitCurrent) {
            return new Promise<T>(resolve => {
                EventService.firesQueue.push(async () => {
                    let result = await EventService.fireExecute<T>(_.clone(EventService.subscriptions[eventName]), eventData);
                    resolve(result);
                });

                if (!EventService.queueInExecution) {
                    EventService.queueInExecution = true;

                    let queueExec = async (fireItem: () => Promise<T>): Promise<void> => {
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

        return await EventService.fireExecute<T>(_.clone(EventService.subscriptions[eventName]), eventData);
    }

    private static async fireExecute<T>(subscriptions: {
        key: string;
        action: (eventData: T) => Promise<T>
    }[], eventData: T): Promise<T> {
        let subscription = subscriptions[0];
        if (!subscription) return undefined;
        let actionResult: T = await subscription.action(eventData);
        if (typeof actionResult !== "undefined") return actionResult;
        if (subscriptions.length == 0) return undefined;

        return await EventService.fireExecute<T>(_.pull(subscriptions, subscription), eventData);
    }
}