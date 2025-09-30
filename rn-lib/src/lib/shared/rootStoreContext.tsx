import { createContext, PropsWithChildren, useContext, useState } from 'react';
import { createRootStore, RootDeps, RootStore } from './rootStore';

const StoreContext = createContext<RootStore | null>(null);

export function StoreProvider({
  children,
  deps,
}: PropsWithChildren<{ deps: RootDeps }>) {
  const [store] = useState(() => createRootStore(deps));
  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

export function useRootStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('StoreProvider manquant');
  return ctx;
}

export function useAuthStore() {
  return useRootStore().auth;
}

export function usePlayingStore() {
  return useRootStore().playing;
}
