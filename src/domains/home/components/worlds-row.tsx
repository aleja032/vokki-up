import { Globe } from 'lucide-react';
import type { WorldProgress } from '@/lib/home/home-hand.types';
import { homeDashboardData } from '../data';
import { WorldArchCard } from './world-arch-card';
import './worlds-row.css';

export function WorldsRow({ worlds }: { worlds: WorldProgress[] }) {
  if (worlds.length === 0) return null;

  return (
    <section aria-labelledby="worlds-title" className="worlds-row">
      <h2 className="worlds-row__title" id="worlds-title">
        <Globe aria-hidden="true" size={24} strokeWidth={2.2} />
        {homeDashboardData.copy.worldsHeading}
      </h2>
      <div className="worlds-row__list">
        {worlds.map(world => (
          <WorldArchCard key={world.id} world={world} />
        ))}
      </div>
    </section>
  );
}
