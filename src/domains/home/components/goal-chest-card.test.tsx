import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { GoalChestCard } from './goal-chest-card';

const progress = {
  completed: 8,
  target: 20,
  ringDashArray: '0 0',
  weeklyActivity: []
};

describe('GoalChestCard', () => {
  it('shows the count, a 10-segment bar and the remaining text', () => {
    const html = renderToStaticMarkup(<GoalChestCard progress={progress} />);

    expect(html).toContain('8 / 20 tarjetas');
    expect(html.match(/progress-bar__segment/g)).toHaveLength(10);
    expect(html.match(/data-filled="true"/g)).toHaveLength(4);
    expect(html).toContain('12 tarjetas más y abres el cofre.');
    expect(html).toContain('aria-label="8 de 20 tarjetas completadas hoy"');
  });

  it('celebrates once the goal is reached', () => {
    const html = renderToStaticMarkup(
      <GoalChestCard progress={{ ...progress, completed: 20 }} />
    );

    expect(html).toContain('Meta cumplida');
    expect(html).not.toContain('abres el cofre.');
  });
});
