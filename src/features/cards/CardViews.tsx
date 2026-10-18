import type { FormEvent } from 'react'
import { formatReviewInterval, scheduleReview } from '../../lib/srs'
import type { StudyCard, StudyRating } from '../../types/study'
import { Panel, SectionHeading } from '../../components/ui/Panel'

const ratingLabels: { rating: StudyRating; label: string }[] = [
  { rating: 'again', label: 'Otra vez' },
  { rating: 'hard', label: 'Difícil' },
  { rating: 'good', label: 'Bien' },
  { rating: 'easy', label: 'Fácil' },
]

export function CardReviewView({
  card, dueCount, reviewCount, revealed, onReveal, onRate,
}: {
  card: StudyCard | undefined
  dueCount: number
  reviewCount: number
  revealed: boolean
  onReveal: () => void
  onRate: (rating: StudyRating) => void
}) {
  return <Panel className="review-panel" labelledBy="review-title">
    <SectionHeading eyebrow="SESIÓN DE HOY" title={<span id="review-title">{dueCount ? `${dueCount} ${dueCount === 1 ? 'tarjeta' : 'tarjetas'} listas` : 'Por ahora, estás al día'}</span>} detail={`${reviewCount} repasos`} />
    {card ? <div className="flashcard" aria-live="polite">
      <span className="flashcard-language">ENGLISH</span>
      <p className="flashcard-prompt">{card.front}</p>
      {revealed ? <><div className="flashcard-divider" /><p className="flashcard-answer">{card.back}</p>{card.note && <p className="flashcard-note">{card.note}</p>}</> : <button className="reveal-button" type="button" onClick={onReveal}>Ver respuesta <span aria-hidden="true">↓</span></button>}
      {revealed && <div className="rating-row" aria-label="¿Cómo te fue?">{ratingLabels.map(({ rating, label }) => <button key={rating} className={`rating-button rating-${rating}`} type="button" onClick={() => onRate(rating)}><strong>{label}</strong><small>{formatReviewInterval(scheduleReview(card, rating).intervalMinutes)}</small></button>)}</div>}
    </div> : <div className="review-complete"><span aria-hidden="true">✦</span><strong>Buen trabajo.</strong><p>Cuando llegue el próximo repaso, tu tarjeta va a aparecer acá.</p></div>}
    <p className="offline-note"><span aria-hidden="true">●</span> Tus tarjetas están disponibles sin conexión.</p>
  </Panel>
}

export function CardEditorView({
  front, back, note, editing, onFrontChange, onBackChange, onNoteChange, onSubmit, onCancel,
}: {
  front: string
  back: string
  note: string
  editing: boolean
  onFrontChange: (value: string) => void
  onBackChange: (value: string) => void
  onNoteChange: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onCancel: () => void
}) {
  return <Panel className="card-editor" labelledBy="card-editor-title">
    <p className="eyebrow">TU VOCABULARIO</p>
    <h2 id="card-editor-title">{editing ? 'Editar tarjeta' : 'Crear una tarjeta'}</h2>
    <p className="card-flow-copy">Agregá una palabra y su significado. Se guarda en este dispositivo.</p>
    <form onSubmit={onSubmit}>
      <label htmlFor="card-front">Palabra o frase en inglés</label>
      <input id="card-front" value={front} onChange={(event) => onFrontChange(event.target.value)} placeholder="e.g. take your time" required maxLength={120} />
      <label htmlFor="card-back">Significado en español</label>
      <input id="card-back" value={back} onChange={(event) => onBackChange(event.target.value)} placeholder="Tomate tu tiempo" required maxLength={180} />
      <label htmlFor="card-note">Ejemplo o nota <span>(opcional)</span></label>
      <textarea id="card-note" value={note} onChange={(event) => onNoteChange(event.target.value)} placeholder="Take your time, there is no rush." rows={3} maxLength={500} />
      <div className="editor-actions"><button className="primary-button" type="submit">{editing ? 'Guardar cambios' : 'Crear tarjeta'} <span aria-hidden="true">→</span></button>{editing && <button className="cancel-edit" type="button" onClick={onCancel}>Cancelar</button>}</div>
    </form>
  </Panel>
}

export function CardLibraryView({ cards, onEdit, onToggleSuspended }: {
  cards: StudyCard[]
  onEdit: (card: StudyCard) => void
  onToggleSuspended: (card: StudyCard) => void
}) {
  return <Panel className="library-panel" labelledBy="library-title">
    <SectionHeading eyebrow="BIBLIOTECA LOCAL" title={<span id="library-title">Tus tarjetas <span className="library-count">{cards.length}</span></span>} detail="Guardadas en este dispositivo" />
    {cards.length === 0 ? <p className="study-empty">Todavía no hay tarjetas. Creá la primera desde el formulario.</p> : <ul className="card-list">{cards.map((card) => (
      <li className={`card-list-item${card.suspended ? ' is-suspended' : ''}`} key={card.id}>
        <div className="card-list-copy"><strong>{card.front}</strong><span>{card.back}</span><small>{card.suspended ? 'Pausada' : card.nextReviewAt <= new Date() ? 'Lista para repasar' : `Próximo repaso: ${card.nextReviewAt.toLocaleDateString('es')}`}</small></div>
        <div className="card-list-actions"><button type="button" onClick={() => onEdit(card)}>Editar</button><button type="button" onClick={() => onToggleSuspended(card)}>{card.suspended ? 'Reanudar' : 'Pausar'}</button></div>
      </li>
    ))}</ul>}
  </Panel>
}
