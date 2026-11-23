import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ReviewCompleteScreen } from './review-complete-screen';
import { ReviewEmptyScreen } from './review-empty-screen';

type Overrides = Partial<Parameters<typeof ReviewCompleteScreen>[0]>;

function render(overrides: Overrides = {}) {
  return renderToStaticMarkup(
    <ReviewCompleteScreen
      bestCombo={5}
      easy={4}
      exitHref="/"
      exitTarget="home"
      good={6}
      hard={2}
      memoryGains={[{ cardId: 'a', term: 'receipt', from: 1, to: 3 }]}
      onRestart={() => undefined}
      reviewed={12}
      streakDays={13}
      {...overrides}
    />
  );
}

describe('ReviewCompleteScreen', () => {
  it('headlines the number of words reviewed', () => {
    const html = render();
    expect(html).toContain('Ronda completada');
    expect(html).toContain('¡Rescataste 12 palabras!');
    expect(html).toContain('world-cafe-words.png');
    expect(html).toContain('noma-cheer.png');
    expect(html).not.toContain('coral');
  });

  it('derives accuracy, best combo and streak from the round', () => {
    const html = render();
    expect(html).toContain('10 / 12');
    expect(html).toContain('x5');
    expect(html).toContain('13 días');
  });

  it('keeps the supporting copy and the rating chips', () => {
    const html = render();
    expect(html).toContain('12 tarjetas repasadas.');
    expect(html).toContain('Tu racha sube a');
    expect(html).toContain('Lo próximo vuelve mañana.');
    expect(html).toContain('2 difíciles');
    expect(html).toContain('6 bien');
    expect(html).toContain('4 fáciles');
    expect(html).toContain('Repasar otra vez no cuenta para la meta diaria.');
  });

  it('lists the words whose memory went up', () => {
    const html = render();
    expect(html).toContain('Subieron de memoria');
    expect(html).toContain('receipt');
    expect(html).toContain('Memoria 1 de 5');
    expect(html).toContain('Memoria 3 de 5');
  });

  it('omits what the round did not produce', () => {
    const html = render({ bestCombo: 0, streakDays: 0, memoryGains: [] });
    expect(html).not.toContain('Mejor combo');
    expect(html).not.toContain('Racha');
    expect(html).not.toContain('Tu racha sube a');
    expect(html).not.toContain('Subieron de memoria');
  });

  it('offers the exit link and a repeat button', () => {
    const home = render();
    expect(home).toContain('href="/"');
    expect(home).toContain('Volver al inicio');
    expect(home).toContain('Repasar otra vez');
    expect(render({ exitTarget: 'cards', exitHref: '/cards' })).toContain(
      'Volver a tarjetas'
    );
  });

  it('never claims a daily-goal chest it cannot measure', () => {
    expect(render()).not.toContain('Cofre');
  });
});

describe('ReviewEmptyScreen', () => {
  it('keeps the up-to-date message and the way back to the cards', () => {
    const html = renderToStaticMarkup(<ReviewEmptyScreen />);
    expect(html).toContain('Por ahora, ya estás al día.');
    expect(html).toContain('href="/cards"');
    expect(html).toContain('Volver a mis tarjetas');
  });
});
