const { ThrottleThrough } = require('..');
jest.useFakeTimers({ advanceTimers: true });

describe('ThrottleThrough', function() {
    test('when first received then emit right away', () => {
        const testListener = jest.fn();
        const through = new ThrottleThrough(1000);
        through.addTriggerListener(testListener);

        through.receive(100);
        through.receive(200);

        expect(testListener).toBeCalledTimes(1);
        expect(testListener).toHaveBeenNthCalledWith(1, [100]);
    });
    test('when the duration between receives is less than interval then only emit once', () => {
        const listener1 = jest.fn();
        const through = new ThrottleThrough(1000);
        through.addTriggerListener(listener1);

        through.receive(100);
        through.receive(200);
        through.receive(300);

        expect(listener1).toBeCalledTimes(1);
        expect(listener1).toHaveBeenNthCalledWith(1, [100]);

        jest.advanceTimersByTime(1000);

        expect(listener1).toBeCalledTimes(2);
        expect(listener1).toHaveBeenNthCalledWith(2, [200, 300]);

        jest.advanceTimersByTime(1000);

        expect(listener1).toBeCalledTimes(2);
    });
    test('when eachLimit is default then flush all message on each trigger', () => {
        const listener1 = jest.fn();
        const through = new ThrottleThrough(1000);
        through.addTriggerListener(listener1);

        through.receive(100);
        through.receive(200);
        through.receive(300);
        through.receive(400);
        through.receive(500);
        through.receive(600);

        expect(listener1).toBeCalledTimes(1);

        jest.advanceTimersByTime(400);
        expect(listener1).toBeCalledTimes(1);
        jest.advanceTimersByTime(600);
        expect(listener1).toBeCalledTimes(2);
        jest.advanceTimersByTime(600);
        expect(listener1).toBeCalledTimes(2);
        jest.advanceTimersByTime(400);
        expect(listener1).toBeCalledTimes(2);
        jest.advanceTimersByTime(1000);
        expect(listener1).toBeCalledTimes(2);

        expect(listener1).toHaveBeenNthCalledWith(1, [100]);
        expect(listener1).toHaveBeenNthCalledWith(2, [200, 300, 400, 500, 600]);
    });
    test('the size of each trigger will not more than the each-limit-size [1]', () => {
        const listener1 = jest.fn();
        const through = new ThrottleThrough(1000, 2);
        through.addTriggerListener(listener1);

        through.receive(100);
        through.receive(200);
        through.receive(300);
        through.receive(400);
        through.receive(500);
        through.receive(600);

        jest.advanceTimersByTime(500);
        jest.advanceTimersByTime(500);
        jest.advanceTimersByTime(400);
        jest.advanceTimersByTime(600);
        jest.advanceTimersByTime(600);
        jest.advanceTimersByTime(400);
        jest.advanceTimersByTime(1000);
        jest.advanceTimersByTime(1000);

        expect(listener1).toBeCalledTimes(4);
        expect(listener1).toHaveBeenNthCalledWith(1, [100]);
        expect(listener1).toHaveBeenNthCalledWith(2, [200, 300]);
        expect(listener1).toHaveBeenNthCalledWith(3, [400, 500]);
        expect(listener1).toHaveBeenNthCalledWith(4, [600]);
    });
    test('the size of each trigger will not more than the each-limit-size [2]', () => {
        const listener1 = jest.fn();
        const through = new ThrottleThrough(1000, 2);
        through.addTriggerListener(listener1);

        through.receive(100);
        through.receive([200, 300, 400, 500, 600]);

        jest.advanceTimersByTime(1000);
        jest.advanceTimersByTime(1000);
        jest.advanceTimersByTime(1000);
        jest.advanceTimersByTime(1000);
        jest.advanceTimersByTime(1000);

        expect(listener1).toBeCalledTimes(4);
        expect(listener1).toHaveBeenNthCalledWith(1, [100]);
        expect(listener1).toHaveBeenNthCalledWith(2, [200, 300]);
        expect(listener1).toHaveBeenNthCalledWith(3, [400, 500]);
        expect(listener1).toHaveBeenNthCalledWith(4, [600]);
    });
});
