import { useCallback } from 'react';
import { useRetryOnSleep } from './useRetryOnSleep';
import { GeneratedScheduleApi } from '../services/api';

const POLL_INTERVAL_MS = 1500;
const POLL_MAX_ATTEMPTS = 120;

async function waitForScheduleJob(jobId) {
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));

    for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
        const { data } = await GeneratedScheduleApi.getScheduleGenerationJob(jobId);

        if (data.status === 'done') return data;
        if (data.status === 'failed') throw new Error(data.error || 'Schedule generation failed.');

        if (attempt < POLL_MAX_ATTEMPTS - 1) await wait(POLL_INTERVAL_MS);
    }

    throw new Error('Schedule generation timed out. Please try again.');
}

/**
 * useScheduleCreate
 *
 * Hook de domínio: encapsula submit + polling da escala.
 * O retry de sleep fica no useRetryOnSleep por baixo.
 */
export function useScheduleCreate() {
    const createAndPoll = useCallback(async (payload) => {
        const response = await GeneratedScheduleApi.createSchedulePreviewJob(payload);
        const jobId = response.data.job_id;
        return waitForScheduleJob(jobId);
    }, []);

    return useRetryOnSleep(createAndPoll, {
        retryDelayMs: 50000,
        maxAutoRetries: 1,
        messages: {
            running: {
                title: 'Generating schedule…',
                description: 'The server is calculating the best allocation for your team.',
            },
            waking_up: {
                title: 'Activating generation server…',
                description: (countdown) =>
                    `The processing server was in sleep mode. Retrying automatically in ${countdown}s…`,
            },
        },
    });
}