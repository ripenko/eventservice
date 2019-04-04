"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var EventService = /** @class */ (function () {
    function EventService() {
    }
    /**
     * Subscribe to event
     * @param eventName The name of event
     * @param callback The function callback that will be invoked when event will be fired
     * @param key The optional param. The key of subscription. Used to identify the subscription for method `off`
     */
    EventService.on = function (eventName, callback, key) {
        if (key === void 0) { key = null; }
        if (!EventService.subscriptions[eventName])
            EventService.subscriptions[eventName] = [];
        EventService.subscriptions[eventName].push({
            key: key,
            action: callback
        });
    };
    /**
     * Unsubscribe from event
     * @param eventName The name of event
     * @param key The key that identify subscription. Use certain key that has been given in method `on`
     */
    EventService.off = function (eventName, key) {
        if (key === void 0) { key = null; }
        EventService.log("EventService.off(\"" + eventName + "\", \"" + key + "\")");
        if (!EventService.subscriptions[eventName])
            return;
        EventService.subscriptions[eventName] = EventService.subscriptions[eventName].filter(function (x) { return x.key !== key; });
        EventService.log("EventService.subscription[\"" + eventName + "\"]", EventService.subscriptions[eventName]);
    };
    /**
     * Fire event.
     * Also this method will wait for subscriber callback.
     * @param eventName The name of event
     * @param eventData The data that will be passed to subscriber's callback method
     */
    EventService.fire = function (eventName, eventData) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                EventService.log("Event '" + eventName + "' has been executed: " + (EventService.subscriptions[eventName] ? EventService.subscriptions[eventName].length : 0), eventData);
                if (!EventService.subscriptions[eventName])
                    return [2 /*return*/, undefined];
                return [2 /*return*/, EventService.fireExecute(lodash_1.clone(EventService.subscriptions[eventName]), eventData)];
            });
        });
    };
    EventService.clear = function () {
        EventService.subscriptions = {};
    };
    EventService.fireExecute = function (subscriptions, eventData) {
        return __awaiter(this, void 0, void 0, function () {
            var subscription, actionResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        subscription = subscriptions[0];
                        if (!subscription)
                            return [2 /*return*/, undefined];
                        return [4 /*yield*/, subscription.action(eventData)];
                    case 1:
                        actionResult = _a.sent();
                        if (subscriptions.length <= 1)
                            return [2 /*return*/, actionResult];
                        return [2 /*return*/, EventService.fireExecute(lodash_1.pull(subscriptions, subscription), actionResult === undefined ? eventData : actionResult)];
                }
            });
        });
    };
    EventService.log = function (message, data) {
        if (console && console.EventServiceDebug) {
            console.log(message, data);
        }
    };
    EventService.subscriptions = {};
    return EventService;
}());
exports.default = EventService;
//# sourceMappingURL=EventService.js.map