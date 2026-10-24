'use client';

import Link from 'next/link';
import { useState } from 'react';
import { CARD_PARTS_OF_SPEECH } from '@/domains/cards/card-create.schema';
import type { VocabularyCard } from '@/domains/cards/types';
import { useCardCaptureFlow } from '../hooks/use-card-capture-flow';
import type { CaptureProposal } from '../types';
import { aiMessages } from '../messages';
import { AiCaptureFrame } from './ai-capture-frame';
import { AiCaptureIcon } from './ai-capture-icon';
import { AiCaptureSteps } from './ai-capture-steps';

const messages = aiMessages;

export function AiCaptureWorkflow() {
  const flow = useCardCaptureFlow();
  const [editingId, setEditingId] = useState<string | null>(null);

  if (flow.step === 'review') {
    return (
      <ReviewStep
        flow={flow}
        editingId={editingId}
        setEditingId={setEditingId}
      />
    );
  }

  if (flow.step === 'created') {
    return <CreatedStep cards={flow.createdCards} reset={flow.reset} />;
  }

  return <AddStep flow={flow} />;
}

type CaptureFlow = ReturnType<typeof useCardCaptureFlow>;

function AddStep({ flow }: { flow: CaptureFlow }) {
  const selectedFile = flow.image;

  return (
    <AiCaptureFrame
      mobileTitle={messages.frame.mobileTitle}
      backHref="/cards"
      backLabel={messages.frame.backToCardsLabel}
      connection="online"
      hasMobileTabs
      footer={
        <>
          <button
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            type="submit"
            form="card-ai-capture"
            disabled={flow.isSubmitting || (!flow.text.trim() && !selectedFile)}
          >
            {flow.isSubmitting ? 'Procesando…' : 'Generar propuestas'}
            <AiCaptureIcon name="arrowRight" size={18} />
          </button>
          <span className="aicap-footer__hint">
            La IA solo se usa cuando estás conectado.
          </span>
        </>
      }
    >
      <form
        id="card-ai-capture"
        className="aicap-form"
        onSubmit={event => {
          event.preventDefault();
          void flow.generate();
        }}
      >
        <AiCaptureSteps active={1} />
        <section className="aicap-block" aria-labelledby="aicap-words">
          <label
            className="aicap-block__title"
            id="aicap-words"
            htmlFor="aicap-text"
          >
            Palabras o frases
          </label>
          <textarea
            id="aicap-text"
            className="aicap-textarea"
            rows={4}
            value={flow.text}
            onChange={event => flow.setText(event.target.value)}
            placeholder="Escribe varias palabras separadas por comas o líneas nuevas"
          />
          <span className="aicap-block__hint">
            La IA corregirá la ortografía y agregará significado, fonética,
            ejemplo y dos palabras relacionadas.
          </span>
        </section>

        <div className="aicap-divider">
          <span />o<span />
        </div>

        <section className="aicap-block" aria-labelledby="aicap-image">
          <h2 className="aicap-block__title" id="aicap-image">
            Captura vocabulario desde una imagen
          </h2>
          {!selectedFile ? (
            <div className="aicap-dropzone">
              <span className="aicap-dropzone__icon">
                <AiCaptureIcon name="image" size={26} />
              </span>
              <span className="aicap-dropzone__text">
                Elige una foto o toma una captura con tu teléfono.
              </span>
              <label
                className="aicap-button aicap-button--outline"
                htmlFor="card-ai-image"
              >
                <AiCaptureIcon name="upload" size={18} />
                Elegir imagen
              </label>
              <input
                id="card-ai-image"
                className="sr-only"
                type="file"
                accept="image/jpeg,image/png"
                capture="environment"
                onChange={event =>
                  flow.setImage(event.target.files?.[0] ?? null)
                }
              />
              <span className="aicap-dropzone__limits">
                JPG o PNG, máximo 10 MB
              </span>
            </div>
          ) : (
            <div className="aicap-file">
              <div className="aicap-file__thumb" aria-hidden="true">
                <AiCaptureIcon name="image" size={20} />
              </div>
              <span className="aicap-file__copy">
                <span className="aicap-file__name">{selectedFile.name}</span>
                <span className="aicap-file__detail">
                  {Math.ceil(selectedFile.size / 1024)} KB · lista para analizar
                </span>
              </span>
              <button
                className="aicap-file__remove"
                type="button"
                onClick={() => flow.setImage(null)}
                aria-label="Descartar imagen"
              >
                <AiCaptureIcon name="close" size={18} />
              </button>
            </div>
          )}
        </section>

        <section className="aicap-block" aria-labelledby="aicap-group">
          <label
            className="aicap-block__title"
            id="aicap-group"
            htmlFor="aicap-group-select"
          >
            Grupo
          </label>
          <select
            id="aicap-group-select"
            className="aicap-textarea"
            value={flow.selectedGroupId}
            onChange={event => flow.setSelectedGroupId(event.target.value)}
          >
            {flow.groups.map(group => (
              <option value={group.id} key={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <span className="aicap-block__hint">
            Las tarjetas aceptadas se guardarán en este grupo.
          </span>
        </section>

        {flow.error && (
          <p className="aicap-alert" role="alert">
            {flow.error}
          </p>
        )}
      </form>
    </AiCaptureFrame>
  );
}

function ReviewStep({
  flow,
  editingId,
  setEditingId
}: {
  flow: CaptureFlow;
  editingId: string | null;
  setEditingId: (id: string | null) => void;
}) {
  const accepted = flow.proposals.filter(
    proposal => proposal.status === 'accepted'
  ).length;
  const pending = flow.proposals.filter(
    proposal => proposal.status === 'pending'
  ).length;

  return (
    <AiCaptureFrame
      layout="wide"
      spacing="tight"
      mobileTitle="Revisar propuestas"
      mobileSubtitle={`${accepted} seleccionadas · ${flow.proposals.length} encontradas`}
      backHref="/cards/ai"
      backLabel="Volver a capturar"
      isFooterMobileOnly
      footer={
        <>
          <button
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            type="button"
            onClick={flow.createCards}
            disabled={!accepted}
          >
            Crear {accepted} tarjetas
          </button>
          <span className="aicap-footer__hint">
            {pending} pendientes de revisar
          </span>
        </>
      }
    >
      <AiCaptureSteps active={2} isMobileOnly />
      <div className="aicap-review" data-state="default">
        <section
          className="aicap-review__main"
          aria-labelledby="aicap-review-title"
        >
          <div className="aicap-review__head">
            <div className="aicap-review__heading">
              <h2 id="aicap-review-title">Revisa tus tarjetas</h2>
              <span>
                {flow.proposals.length} propuestas · {accepted} seleccionadas
              </span>
            </div>
            <div className="aicap-bulk">
              <button
                className="aicap-bulk__accept"
                type="button"
                onClick={flow.acceptAll}
              >
                Aceptar todas
              </button>
              <button
                className="aicap-bulk__discard"
                type="button"
                onClick={flow.rejectAll}
              >
                Descartar todas
              </button>
            </div>
          </div>
          {flow.error && (
            <p className="aicap-alert" role="alert">
              {flow.error}
            </p>
          )}
          <div className="aicap-proposals">
            {flow.proposals.map(proposal => (
              <DynamicProposal
                key={proposal.id}
                proposal={proposal}
                editing={editingId === proposal.id}
                onEdit={() =>
                  setEditingId(editingId === proposal.id ? null : proposal.id)
                }
                onUpdate={update => flow.updateProposal(proposal.id, update)}
                onStatus={status => flow.setProposalStatus(proposal.id, status)}
              />
            ))}
          </div>
          <div className="aicap-savebar">
            <span className="aicap-savebar__hint">
              Edita cualquier campo antes de guardarla.
            </span>
            <div className="aicap-savebar__actions">
              <Link
                className="aicap-button aicap-button--outline aicap-button--lg"
                href="/cards"
              >
                Cancelar
              </Link>
              <button
                className="aicap-button aicap-button--primary aicap-button--lg"
                type="button"
                onClick={flow.createCards}
                disabled={!accepted}
              >
                Crear {accepted} tarjetas
              </button>
            </div>
          </div>
        </section>
      </div>
    </AiCaptureFrame>
  );
}

function DynamicProposal({
  proposal,
  editing,
  onEdit,
  onUpdate,
  onStatus
}: {
  proposal: CaptureProposal;
  editing: boolean;
  onEdit: () => void;
  onUpdate: (update: Partial<CaptureProposal>) => void;
  onStatus: (status: CaptureProposal['status']) => void;
}) {
  const accepted = proposal.status === 'accepted';
  const rejected = proposal.status === 'rejected';
  if (rejected) {
    return (
      <div className="aicap-rejected">
        <span className="aicap-rejected__text">
          <s>{proposal.word}</s> · descartada
        </span>
        <button
          className="aicap-rejected__undo"
          type="button"
          onClick={() => onStatus('pending')}
        >
          Deshacer
        </button>
      </div>
    );
  }
  return (
    <article
      className="aicap-proposal"
      data-tone={accepted ? 'accepted' : 'pending'}
    >
      <div className="aicap-proposal__top">
        <span className="aicap-proposal__source">
          {proposal.source === 'image' ? 'Desde imagen' : 'Texto ingresado'}
        </span>
        <span
          className="aicap-proposal__pill"
          data-tone={accepted ? 'accepted' : 'pending'}
        >
          {accepted ? 'Seleccionada' : 'Pendiente'}
        </span>
      </div>
      {proposal.original && (
        <div className="aicap-correction">
          <span className="aicap-correction__text">
            <strong>Corrección:</strong> <s>{proposal.original}</s> →{' '}
            <strong>{proposal.word}</strong>
          </span>
        </div>
      )}
      <div className="aicap-proposal__head">
        <div className="aicap-proposal__word">
          {editing ? (
            <input
              className="aicap-textarea"
              value={proposal.word}
              onChange={event => onUpdate({ word: event.target.value })}
              aria-label="Palabra"
            />
          ) : (
            <span className="aicap-proposal__term">{proposal.word}</span>
          )}
          <span className="aicap-proposal__ipa">
            {proposal.phonetics || 'Sin fonética'}
          </span>
        </div>
        <span
          className="aicap-proposal__category"
          data-category={proposal.partOfSpeech}
        >
          {proposal.partOfSpeech}
        </span>
      </div>
      {editing ? (
        <>
          <input
            className="aicap-textarea"
            value={proposal.meaning}
            onChange={event => onUpdate({ meaning: event.target.value })}
            aria-label="Significado"
          />
          <input
            className="aicap-textarea"
            value={proposal.example}
            onChange={event => onUpdate({ example: event.target.value })}
            aria-label="Ejemplo en inglés"
          />
          <select
            className="aicap-textarea"
            value={proposal.partOfSpeech}
            onChange={event => onUpdate({ partOfSpeech: event.target.value })}
            aria-label="Categoría"
          >
            {CARD_PARTS_OF_SPEECH.map(part => (
              <option key={part}>{part}</option>
            ))}
          </select>
          <input
            className="aicap-textarea"
            value={proposal.relatedWords.join(', ')}
            onChange={event =>
              onUpdate({
                relatedWords: event.target.value
                  .split(',')
                  .map(value => value.trim())
                  .filter(Boolean)
                  .slice(0, 2)
              })
            }
            aria-label="Palabras relacionadas"
          />
        </>
      ) : (
        <>
          <span className="aicap-proposal__meaning">{proposal.meaning}</span>
          <span className="aicap-proposal__example">{proposal.example}</span>
          <div className="aicap-proposal__related">
            <span className="aicap-proposal__related-label">Relacionadas</span>
            {proposal.relatedWords.map(word => (
              <span className="aicap-proposal__related-chip" key={word}>
                {word}
              </span>
            ))}
          </div>
        </>
      )}
      <div className="aicap-proposal__actions">
        <button
          className="aicap-action aicap-action--reject"
          type="button"
          onClick={() => onStatus('rejected')}
        >
          Descartar
        </button>
        <button className="aicap-action" type="button" onClick={onEdit}>
          {editing ? 'Listo' : 'Editar'}
        </button>
        <button
          className="aicap-action aicap-action--accept"
          type="button"
          onClick={() => onStatus(accepted ? 'pending' : 'accepted')}
        >
          {accepted ? 'Quitar' : 'Aceptar'}
        </button>
      </div>
    </article>
  );
}

function CreatedStep({
  cards,
  reset
}: {
  cards: VocabularyCard[];
  reset: () => void;
}) {
  return (
    <AiCaptureFrame
      mobileTitle="Tarjetas creadas"
      backHref="/cards"
      backLabel="Volver a tarjetas"
      spacing="medium"
      footer={
        <>
          <Link
            className="aicap-button aicap-button--primary aicap-button--lg aicap-footer__main"
            href="/cards"
          >
            Ver mis tarjetas <AiCaptureIcon name="arrowRight" size={18} />
          </Link>
          <button
            className="aicap-button aicap-button--outline aicap-button--md"
            type="button"
            onClick={reset}
          >
            Crear más
          </button>
        </>
      }
    >
      <AiCaptureSteps active={3} />
      <section className="aicap-hero aicap-hero--padded">
        <div className="aicap-hero__icon aicap-hero__icon--success">
          <AiCaptureIcon name="check" size={48} />
        </div>
        <h2 className="aicap-display aicap-display--lg">
          {cards.length} tarjetas creadas
        </h2>
        <p className="aicap-hero__body aicap-hero__body--lg">
          Se guardaron localmente en tu grupo y están listas para repasar.
        </p>
      </section>
      <section className="aicap-list" aria-label="Tarjetas creadas">
        {cards.map(card => (
          <div className="aicap-list__row" key={card.id}>
            <span className="aicap-list__copy">
              <span className="aicap-list__word">{card.term}</span>
              <span className="aicap-list__meaning">{card.meaning}</span>
            </span>
            <span
              className="aicap-list__category"
              data-category={card.partOfSpeech}
            >
              {card.partOfSpeech}
            </span>
          </div>
        ))}
      </section>
      <span className="aicap-stored">
        <AiCaptureIcon name="device" size={14} />
        Guardadas en este dispositivo
      </span>
    </AiCaptureFrame>
  );
}
