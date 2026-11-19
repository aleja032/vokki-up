import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { WeekLeafChart } from './week-leaf-chart';

const days = [
  { day: 'Lun', count: 14, level: 3 as const, isToday: false },
  { day: 'Mar', count: 0, level: 0 as const, isToday: false },
  { day: 'Mié', count: 8, level: 2 as const, isToday: true }
];

describe('WeekLeafChart', () => {
  it('describes the week for assistive tech', () => {
    const html = renderToStaticMarkup(<WeekLeafChart days={days} />);

    expect(html).toContain(
      'Tarjetas repasadas esta semana: Lun 14, Mar 0, Mié 8'
    );
    expect(html).toContain('Tarjetas repasadas por día');
  });

  it('draws a leaf per active day and a ring for an empty one', () => {
    const html = renderToStaticMarkup(<WeekLeafChart days={days} />);

    expect(html.match(/week-leaf__leaf/g)).toHaveLength(2);
    expect(html.match(/week-leaf__empty/g)).toHaveLength(1);
    expect(html).toContain('data-today="true"');
  });

  it('renders without days', () => {
    expect(() =>
      renderToStaticMarkup(<WeekLeafChart days={[]} />)
    ).not.toThrow();
  });
});
