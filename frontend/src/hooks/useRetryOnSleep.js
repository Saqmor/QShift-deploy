import { useState, useCallback } from "react";

export const STATUS = {
    IDLE: "idle",
    SUCCESS: "success",
    ERROR: "error",
    RUNNING: "running",
    WAKING_UP: "waking_up",
};

const DEFAULT_OPTIONS = {
    retryDelayMs: 6000,
    maxAutoRetries: 1,
    isSleepError: (error) => !error.response,
    messages: {},
};

function defaultMessages(status, countdown) {
    switch (status) {
        case STATUS.RUNNING:
            return {
                title: 'Processing…',
                description: 'Please wait while the server handles your request.',
            };
        case STATUS.WAKING_UP:
            return {
                title: 'Activating server…',
                description: `The server was in sleep mode. Retrying automatically in ${countdown}s…`,
            };
        default:
            return null;
    }
}

export function useRetryOnSleep(asyncFn, options = {}) {
    const { retryDelayMs, maxAutoRetries, isSleepError, messages } = { ...DEFAULT_OPTIONS, ...options };
    const [status, setStatus] = useState(STATUS.IDLE);
    const [retryCountdown, setRetryCountdown] = useState(0);
    const [retriesLeft, setRetriesLeft] = useState(0);
    const [errorInfo, setErrorInfo] = useState(null);

    const getMessage = useCallback((currentStatus, countdown) => {
        const custom = messages[currentStatus];
        if (custom) {
            return {
                title: typeof custom.title === 'function'
                    ? custom.title(countdown)
                    : custom.title,
                description: typeof custom.description === 'function'
                    ? custom.description(countdown)
                    : custom.description,
            };
        }
        return defaultMessages(currentStatus, countdown);
    }, [messages]);

    const startCountdown = useCallback((seconds) => {
        return new Promise((resolve) => {
            let remaining = seconds;
            setRetryCountdown(remaining);

            const interval = setInterval(() => {
                remaining -= 1;
                setRetryCountdown(remaining);
                if (remaining <= 0) {
                    clearInterval(interval);
                    resolve();
                }
            }, 1000);
        });
    }, []);

    const run = useCallback(async (payload) => {
        let attemptsLeft = maxAutoRetries;

        while (attemptsLeft >= 0) {
            try {
                setStatus(STATUS.RUNNING);
                setErrorInfo(null);
                const result = await asyncFn(payload);
                setStatus(STATUS.SUCCESS);
                return { success: true, data: result };
            } catch (error) {
                const sleep = isSleepError(error);
                if (sleep && attemptsLeft > 0) {
                    setStatus(STATUS.WAKING_UP);
                    setRetriesLeft(attemptsLeft);
                    await startCountdown(retryDelayMs / 1000);
                    attemptsLeft -= 1;
                    continue;
                }
                setErrorInfo({ error, sleep });
                setStatus(STATUS.ERROR);
                return { success: false, error };
            }
        }
    }, [asyncFn, maxAutoRetries, retryDelayMs, isSleepError, startCountdown, getMessage]);

    return {
        run,
        status,
        retryCountdown,
        retriesLeft,
        errorInfo,
        getMessage,
    };
}