'use client';

import { createContext, useContext, type ReactNode } from 'react';

export type ShellSessionStatus = 'loading' | 'guest' | 'authenticated';

type ShellSlots = {
  profileAction?: ReactNode;
  profileSummary?: ReactNode;
  sessionStatus?: ShellSessionStatus;
};

const ShellSlotsContext = createContext<ShellSlots>({
  sessionStatus: 'loading'
});

type ShellSlotsProviderProps = ShellSlots & {
  children: ReactNode;
};

export function ShellSlotsProvider({
  children,
  profileAction,
  profileSummary,
  sessionStatus = 'loading'
}: ShellSlotsProviderProps) {
  return (
    <ShellSlotsContext.Provider
      value={{ profileAction, profileSummary, sessionStatus }}
    >
      {children}
    </ShellSlotsContext.Provider>
  );
}

export function useShellSlots() {
  return useContext(ShellSlotsContext);
}

export function ProfileActionSlot() {
  const { profileAction } = useShellSlots();

  return profileAction ?? null;
}

export function ProfileSummarySlot() {
  const { profileSummary } = useShellSlots();

  return profileSummary ?? null;
}

export function AuthenticatedOnly({ children }: { children: ReactNode }) {
  const { sessionStatus } = useShellSlots();

  return sessionStatus === 'authenticated' ? children : null;
}
