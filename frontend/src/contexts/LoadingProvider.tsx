import type { ReactNode } from 'react';
import { LoadingContext } from './LoadingContext';
import type { LoadingContextType } from './LoadingType'

export function LoadingProvider({
  children,
  value
}: {
  children: ReactNode;
  value: LoadingContextType;
}) {
  return (
    <LoadingContext.Provider value={value}>
      {children}
    </LoadingContext.Provider>
  );
}