'use client';

import { Wifi } from 'lucide-react';
import { shellMessages } from '@/config/messages';
import { useConnectivityStatus } from '@/lib/sync/use-connectivity-status';
import { CheckIcon, PhoneIcon } from './navigation-icons';

interface ConnectionStatusProps {
  variant?: 'header' | 'sidebar';
}

export function ConnectionStatus({
  variant = 'header'
}: ConnectionStatusProps) {
  const status = useConnectivityStatus();
  const labels = shellMessages.connection;
  const label =
    status === 'online'
      ? variant === 'header'
        ? labels.upToDate
        : labels.online
      : status === 'offline'
        ? labels.offline
        : labels.checking;
  const icon =
    status === 'online' ? (
      <CheckIcon size={14} />
    ) : status === 'offline' ? (
      <PhoneIcon size={14} />
    ) : (
      <Wifi aria-hidden="true" size={14} strokeWidth={1.8} />
    );

  return (
    <span
      aria-live="polite"
      className={`connection-status connection-status--${variant}`}
      data-status={status}
      role="status"
    >
      {icon}
      <span className="connection-status__label">{label}</span>
    </span>
  );
}
