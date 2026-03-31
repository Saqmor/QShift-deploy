import { useRetryOnSleep } from './useRetryOnSleep';
import { RegisterApi } from '../services/api.js';
import { useCallback } from 'react';

export function useRegister() {
    const registerFn = useCallback(async ({ email, password }) => {
        return RegisterApi.registerUser(email, password);
    }, []);

    return useRetryOnSleep(registerFn, {
        maxAutoRetries: 1,
        retryDelayMs: 25000,
        messages: {
            running: {
                title: 'Signing up…',
                description: 'Please wait while we create your account.',
            },
            wakingUp: {
                title: 'Signing up…',
                description: 'Please wait while we create your account.',
            },
        },
    });
}