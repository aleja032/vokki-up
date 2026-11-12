export type ProfileSessionStatus = 'loading' | 'guest' | 'authenticated';

export interface ProfileVisibilityFlags {
  profileExtras: boolean;
}

export interface VisibleProfileSections {
  language: boolean;
  theme: boolean;
  account: boolean;
  level: boolean;
  dailyGoal: boolean;
  reminder: boolean;
  data: boolean;
}

export function getVisibleProfileSections(
  status: ProfileSessionStatus,
  flags: ProfileVisibilityFlags
): VisibleProfileSections {
  const isResolved = status !== 'loading';
  const isAuthenticated = status === 'authenticated';
  const hasExtras = isResolved && flags.profileExtras;

  return {
    language: true,
    theme: true,
    account: isAuthenticated,
    level: hasExtras,
    dailyGoal: hasExtras,
    reminder: hasExtras,
    data: hasExtras
  };
}
