import { RefreshCw } from 'lucide-react';
import { MolStatusBanner } from '../MolStatusBanner';
import { STATUS } from '../../hooks/useRetryOnSleep';

/**
 * ObjRetryStatusBanner
 *
 * Organismo que orquestra qual variante do MolStatusBanner renderizar
 * baseado no status retornado pelo useRetryOnSleep.
 *
 * @param {string} status — from useRetryOnSleep (idle, running, waking_up, error, success)
 * @param {number} retryCountdown
 * @param {object|null} errorInfo — { error, sleep }
 * @param {function} getMessage — (status, countdown) => { title, description }
 * @param {function} [onRetry]
 * @param {function} [onDismiss]
 */
export function ObjRetryStatusBanner({ status, retryCountdown, errorInfo, getMessage, onRetry, onDismiss }) {
    if (status === STATUS.RUNNING) {
        const msg = getMessage(status, retryCountdown);
        return (
            <MolStatusBanner
                variant="info"
                title={msg.title}
                description={msg.description}
            />
        );
    }

    if (status === STATUS.WAKING_UP) {
        const msg = getMessage(status, retryCountdown);
        return (
            <MolStatusBanner
                variant="warning"
                title={msg.title}
                description={msg.description}
            />
        );
    }

    if (status === STATUS.ERROR && errorInfo) {
        const actions = [];

        if (onRetry) {
            actions.push({
                label: 'Try again',
                icon: RefreshCw,
                onClick: onRetry,
            });
        }
        if (onDismiss) {
            actions.push({
                label: 'Dismiss',
                onClick: onDismiss,
                variant: 'secondary',
            });
        }

        const errorTitle = errorInfo.sleep
            ? 'Server unavailable'
            : 'Request failed';
        const errorDescription = errorInfo.sleep
            ? 'The server could not be reached after multiple attempts. You can try again manually.'
            : errorInfo.error?.response?.data?.detail || errorInfo.error?.message || 'An unexpected error occurred.';

        return (
            <MolStatusBanner
                variant="error"
                title={errorTitle}
                description={errorDescription}
                actions={actions}
            />
        );
    }

    return null;
}