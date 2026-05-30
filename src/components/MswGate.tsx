import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { atom } from 'nanostores';
import type { PropsWithChildren } from 'react';
import { startWorker } from '../mocks/browser';

export const mswReady = atom(false);

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
    return <div data-testid="msw-gate" style={{ height: 0 }} aria-hidden="true" />;
  }

  return <>{children}</>;
}
