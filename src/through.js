function createSizeLimiter(limitSize) {
    return function(messages) {
        return [0, limitSize > 0 ? limitSize : messages.length];
    };
}

class ThrottleThrough {
    constructor(interval, roundLimiter = -1) {
        if (typeof interval !== 'number') {
            throw new Error('interval must be a number');
        }
        if (typeof roundLimiter === 'number') {
            roundLimiter = createSizeLimiter(roundLimiter);
        }
        this._massages = [];
        this._listeners = [];
        this._interval = interval;
        this._roundLimiter = roundLimiter;
        this._last_trigger_time = 0;
        this._timer = -1;
    }

    _trigger() {
        const [start, end] = this._roundLimiter(this._massages);
        const triggerMessages = this._massages.splice(start, end);
        this._listeners.forEach((listener) => listener(triggerMessages));
        this._last_trigger_time = Date.now();
        if (this._massages.length > 0) {
            this._triggerDelay(this._interval);
        }
    }

    _triggerDelay(delay) {
        this._timer = setTimeout(() => {
            this._trigger();
        }, delay);
    }

    receive(messages) {
        clearTimeout(this._timer);
        if (Array.isArray(messages)) {
            this._massages.push(...messages);
        } else {
            this._massages.push(messages);
        }
        const passed = Date.now() - this._last_trigger_time;
        if (passed < this._interval) {
            this._triggerDelay(this._interval - passed);
        } else {
            this._trigger();
        }
    }

    addTriggerListener(listener) {
        this._listeners.push(listener);
        return () => {
            const index = this._listeners.indexOf(listener);
            if (index !== -1) {
                this._listeners.splice(index, 1);
            }
        };
    }
}

exports.ThrottleThrough = ThrottleThrough;
