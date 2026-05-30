import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import type { PropsWithChildren } from 'react';
import { startWorker } from '../mocks/browser';
import { mswReady } from '../stores/msw';
import { getTestId } from '../utils/testId';

export { mswReady } from '../stores/msw';

export default function MswGate({ children }: PropsWithChildren) {
  const ready = useStore(mswReady);

  useEffect(() => {
    if (ready) return;

    void startWorker()
      .then(() => {
        mswReady.set(true);
      })
      .catch((error) => {
        console.error('Failed to start MSW worker', error);
        mswReady.set(true);
      });
  }, [ready]);

  if (!ready) {
    return <div className="msw-gate__placeholder" data-testid={getTestId('msw-gate')} aria-hidden="true" />;
  }

  return <>{children}</>;
}
