import { useCallback } from 'react';
import { useRetryOnSleep } from './useRetryOnSleep';
import { LoginApi } from '../services/api';    // ajuste o import para o seu projeto

/**
 * useLogin
 *
 * Hook de domínio: encapsula a requisição de login com retry para servidor em sleep.
 *
 * O servidor gratuito demora ~45s para acordar, então:
 *  - timeout da requisição: 50s (definido no authApi do axios)
 *  - retryDelayMs: 15s entre tentativas
 *  - maxAutoRetries: 3  →  cobre até ~45s de boot (3 × 15s = 45s de espera total)
 *
 * IMPORTANTE: o axios instance usado em AuthApi.login deve ter timeout >= 50000,
 * caso contrário vai lançar ECONNABORTED antes do servidor terminar de acordar.
 * Configure isso no arquivo onde você cria o axios instance:
 *
 *   const authApi = axios.create({ baseURL: '...', timeout: 50000 });
 */
export function useLogin() {
    const loginFn = useCallback(async ({ email, password }) => {
        const response = await LoginApi.authenticateUser(email, password);
        return response.data;
    }, []);

    return useRetryOnSleep(loginFn, {
        retryDelayMs: 25000,
        maxAutoRetries: 1,
        messages: {
            running: {
                title: 'Signing in…',
                description: 'Connecting to the server.',
            },
            waking_up: {
                title: 'Starting up the server…',
                description: (countdown) =>
                    `The server is waking up from sleep mode — this only happens on the first access after inactivity. Retrying in ${countdown}s…`,
            },
        },
    });
}