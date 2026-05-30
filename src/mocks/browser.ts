import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

export const worker = setupWorker(...handlers);

let startWorkerPromise: ReturnType<typeof worker.start> | undefined;

export function startWorker() {
  startWorkerPromise ??= worker.start({
    onUnhandledRequest: 'warn',
  });

  return startWorkerPromise;
}
