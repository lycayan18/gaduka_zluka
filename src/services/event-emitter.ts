export default class EventEmitter<U extends string, V extends Record<U, unknown[]>> {
    protected callbacks: {
        [T in keyof V]?: Array<(...args: V[T]) => void>;
    };

    constructor() {
        this.callbacks = {};
    }

    on<T extends keyof V>(event: T, callback: (...args: V[T]) => void) {
        if (event in this.callbacks) {
            this.callbacks[event]?.push(callback);
        } else {
            this.callbacks[event] = [callback];
        }
    }

    off<T extends keyof V>(event: T, callback: (...args: V[T]) => void) {
        if (!(event in this.callbacks)) {
            return;
        }

        const eventCallbacks = this.callbacks[event];

        if (eventCallbacks === undefined) {
            return;
        }

        const index = eventCallbacks.indexOf(callback);

        if (index > -1) {
            eventCallbacks.splice(index, 1);
        }
    }

    emit<T extends keyof V>(event: T, ...args: V[T]): Array<any> {
        let results: Array<any> = [];

        if (!(event in this.callbacks)) {
            return results;
        }

        const eventCallbacks = this.callbacks[event];

        if (eventCallbacks === undefined) {
            return results;
        }

        for (let i = 0; i < eventCallbacks.length; i++) {
            const callback = eventCallbacks[i];

            if (callback === undefined) {
                continue;
            }

            results.push(callback(...args));
        }

        return results;
    }
}