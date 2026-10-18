import { useEffect, useRef, useState } from 'react'
import { getConfiguredGeminiClient, getGeminiClientConfig } from './geminiClient'
import { buildLocalQuiz, calculateProgress, MASTERED_CARD_GOAL, scoreQuiz } from './studyProgress'
import {
  completeWritingSession, getActivityHistory, getQuizAttempts, getReviewHistory, getStudyCards,
  getWritingSessions, saveQuizAttempt, saveWritingDraft, seedCardsIfEmpty, StaleWritingSessionError,
} from './studyDb'
import type { QuizAttempt, QuizQuestion, ReviewLog, StudyActivity, StudyCard, WritingSession } from '../types/study'

const writingPrompt = 'Write 120–180 words in English about a habit that helped you learn something difficult. Describe what changed, give one example, and use at least two linking words such as however, because, or therefore.'

function newWritingSession(): WritingSession {
  const now = new Date()
  return { id: crypto.randomUUID(), prompt: writingPrompt, text: '', createdAt: now, updatedAt: now }
}

export function QuizPractice() {
  const [cards, setCards] = useState<StudyCard[]>([])
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [source, setSource] = useState<'local' | 'ai'>('local')
  const [answers, setAnswers] = useState<string[]>([])
  const [index, setIndex] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const finishing = useRef(false)
  const aiConfigured = getGeminiClientConfig() !== null

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void (async () => {
        await seedCardsIfEmpty()
        const [savedCards, savedAttempts] = await Promise.all([getStudyCards(), getQuizAttempts()])
        setCards(savedCards)
        setAttempts(savedAttempts)
      })().catch(() => setError('No pudimos abrir tus quizzes locales. Revisá el almacenamiento del navegador.'))
        .finally(() => setLoading(false))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const start = (nextQuestions: QuizQuestion[], nextSource: 'local' | 'ai') => {
    setQuestions(nextQuestions)
    setSource(nextSource)
    setAnswers([])
    setIndex(0)
    setCompleted(false)
    setError('')
  }

  const startLocal = () => {
    const localQuestions = buildLocalQuiz(cards)
    if (!localQuestions.length) {
      setError('Necesitás al menos dos tarjetas activas con significados distintos. Agregalas en Tarjetas y volvé acá.')
      return
    }
    start(localQuestions, 'local')
  }

  const startAi = async () => {
    const client = getConfiguredGeminiClient()
    if (!client || !cards.length) return
    setBusy(true)
    setError('')
    try {
      const material = cards.filter((card) => !card.suspended).slice(0, 15)
        .map((card) => `${card.front}: ${card.back}. ${card.note}`).join('\n').slice(0, 5000)
      if (!material.trim()) throw new Error('Agregá tarjetas activas antes de pedir un quiz asistido.')
      const result = await client.request('quiz', { text: material })
      if (!result.questions.length) throw new Error('La IA no devolvió preguntas. Probá otra vez o usá el quiz local.')
      start(result.questions, 'ai')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudo generar el quiz. El quiz local sigue disponible.')
    } finally {
      setBusy(false)
    }
  }

  const choose = (answer: string) => {
    if (answers[index] !== undefined) return
    setAnswers((current) => current[index] === undefined ? [...current, answer] : current)
  }

  const finish = async () => {
    if (finishing.current || busy || answers.length !== questions.length) return
    finishing.current = true
    setBusy(true)
    try {
      const score = scoreQuiz(questions, answers)
      const attempt: QuizAttempt = {
        id: crypto.randomUUID(), source, correctCount: score.correct,
        questionCount: score.total, completedAt: new Date(),
      }
      await saveQuizAttempt(attempt)
      setAttempts((current) => [attempt, ...current])
      setCompleted(true)
      setError('')
    } catch {
      setError('No se pudo guardar el resultado. Probá de nuevo; tus respuestas siguen acá.')
    } finally {
      finishing.current = false
      setBusy(false)
    }
  }

  const question = questions[index]
  const selected = answers[index]
  const score = scoreQuiz(questions, answers)

  return <section className="study-page activity-page" aria-labelledby="module-title">
    <div className="study-page-heading"><div><p className="eyebrow">PONÉ A PRUEBA LO QUE SABÉS</p><h1 id="module-title">Un desafío breve, una idea más clara.</h1><p className="module-description">Practicá con tus tarjetas sin conexión. Cada respuesta te muestra por qué está bien o qué repasar.</p></div><div className="study-stats"><strong>{attempts.length}</strong><span>quizzes completados</span></div></div>
    {error && <p className="study-error" role="alert">{error}</p>}
    {loading ? <p className="study-empty" role="status">Abriendo tus quizzes…</p> : <div className="activity-layout">
      <section className="activity-panel" aria-label="Sesión de quiz">
        {!questions.length ? <>
          <p className="eyebrow">PRÁCTICA LOCAL</p><h2>Empezá cuando quieras.</h2>
          <p>Armamos preguntas con tus tarjetas activas. Necesitás al menos dos significados distintos.</p>
          <div className="activity-actions"><button className="primary-button" type="button" onClick={startLocal}>Empezar quiz local →</button>{aiConfigured && <button className="secondary-button" type="button" onClick={() => void startAi()} disabled={busy || !cards.length}>{busy ? 'Generando preguntas…' : 'Generar con IA'}</button>}</div>
          <p className="offline-note">{aiConfigured ? 'Solo “Generar con IA” envía el texto de tus tarjetas a Supabase y Gemini.' : 'La IA no está configurada; el quiz local funciona sin conexión.'}</p>
        </> : completed ? <>
          <p className="eyebrow">SESIÓN COMPLETADA</p><h2>{score.correct} de {score.total} correctas</h2>
          <p>Tu resultado quedó guardado en este dispositivo. Repasar y volver a intentar también cuenta como práctica.</p>
          <div className="activity-actions"><button className="primary-button" type="button" onClick={() => start(questions, source)}>Reintentar este quiz →</button><button className="secondary-button" type="button" onClick={startLocal}>Nuevo quiz local</button></div>
        </> : <>
          <p className="eyebrow">PREGUNTA {index + 1} DE {questions.length} · {source === 'ai' ? 'GENERADA CON IA' : 'DESDE TUS TARJETAS'}</p>
          <h2>{question.question}</h2>
          <div className="quiz-options" role="group" aria-label="Opciones de respuesta">{question.options.map((option, optionIndex) => <button key={`${option}-${optionIndex}`} type="button" disabled={selected !== undefined} className={`quiz-option${selected !== undefined && option === question.answer ? ' is-correct' : ''}${selected === option && option !== question.answer ? ' is-incorrect' : ''}`} onClick={() => choose(option)}>{option}</button>)}</div>
          {selected !== undefined && <div className={`quiz-feedback${selected === question.answer ? ' is-correct' : ' is-incorrect'}`} role="status"><strong>{selected === question.answer ? '¡Correcto!' : `La respuesta es: ${question.answer}`}</strong><p>{question.explanation}</p></div>}
          {selected !== undefined && <div className="activity-actions"><button className="primary-button" type="button" disabled={busy} onClick={() => index + 1 < questions.length ? setIndex(index + 1) : void finish()}>{index + 1 < questions.length ? 'Siguiente pregunta →' : busy ? 'Guardando…' : 'Ver resultado →'}</button></div>}
        </>}
      </section>
      <aside className="activity-panel" aria-label="Historial de quizzes"><p className="eyebrow">TU HISTORIAL LOCAL</p><h2>Práctica completada</h2>{attempts.length ? <ul className="activity-history">{attempts.slice(0, 5).map((attempt) => <li key={attempt.id}><strong>{attempt.correctCount}/{attempt.questionCount} correctas</strong><span>{attempt.source === 'ai' ? 'Con IA' : 'Local'} · {attempt.completedAt.toLocaleDateString('es')}</span></li>)}</ul> : <p>Todavía no completaste un quiz. Tu primer resultado va a aparecer acá.</p>}</aside>
    </div>}
  </section>
}

export function WritingPractice() {
  const [session, setSession] = useState<WritingSession | null>(null)
  const [history, setHistory] = useState<WritingSession[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [saveStatus, setSaveStatus] = useState('')
  const [error, setError] = useState('')
  const completing = useRef(false)
  const aiConfigured = getGeminiClientConfig() !== null

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void getWritingSessions().then((sessions) => {
        setHistory(sessions.filter((item) => item.completedAt))
        setSession(sessions.find((item) => !item.completedAt) ?? sessions[0] ?? newWritingSession())
      }).catch(() => setError('No pudimos abrir tus textos locales. Revisá el almacenamiento del navegador.'))
        .finally(() => setLoading(false))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!session?.text || session.completedAt) return
    const draft = session
    const timer = window.setTimeout(() => {
      void saveWritingDraft(draft).then(() => setSaveStatus('Borrador guardado en este dispositivo.'))
        .catch(() => setError('No se pudo guardar el borrador. Conservá esta pestaña abierta y probá de nuevo.'))
    }, 350)
    return () => window.clearTimeout(timer)
  }, [session])

  const editText = (text: string) => {
    if (!session) return
    setSession({ ...session, text, updatedAt: new Date(), feedback: undefined })
    setSaveStatus('Guardando borrador…')
    setError('')
  }

  const requestFeedback = async () => {
    const client = getConfiguredGeminiClient()
    if (!client || !session || session.completedAt || session.text.trim().length < 40) return
    setBusy(true)
    setError('')
    try {
      await saveWritingDraft(session)
      const feedback = await client.request('writing-feedback', { text: session.text.trim() })
      const updated = { ...session, feedback, updatedAt: new Date() }
      await saveWritingDraft(updated)
      setSession(updated)
      setSaveStatus('Comentarios guardados en este dispositivo.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'No se pudieron obtener comentarios. Podés finalizar sin IA.')
    } finally {
      setBusy(false)
    }
  }

  const finish = async () => {
    if (!session || session.completedAt || busy || completing.current || session.text.trim().length < 40) return
    completing.current = true
    setBusy(true)
    try {
      const completed = { ...session, text: session.text.trim(), completedAt: new Date() }
      await completeWritingSession(completed)
      const saved = { ...completed, updatedAt: completed.completedAt }
      setSession(saved)
      setHistory((current) => [saved, ...current.filter((item) => item.id !== saved.id)])
      setSaveStatus('Sesión completada y guardada en este dispositivo.')
      setError('')
    } catch (cause) {
      setError(cause instanceof StaleWritingSessionError
        ? 'Hay un borrador más reciente guardado. Recargá la página para recuperarlo antes de finalizar.'
        : 'No se pudo finalizar la sesión. Tu texto sigue en pantalla para que lo intentes de nuevo.')
    } finally {
      completing.current = false
      setBusy(false)
    }
  }

  const wordCount = session?.text.trim() ? session.text.trim().split(/\s+/).length : 0

  return <section className="study-page activity-page" aria-labelledby="module-title">
    <div className="study-page-heading"><div><p className="eyebrow">ESCRIBÍ CON CONFIANZA</p><h1 id="module-title">Tus ideas, en inglés.</h1><p className="module-description">Practicá a tu ritmo. El borrador se guarda acá; los comentarios de IA son opcionales.</p></div><div className="study-stats"><strong>{history.length}</strong><span>sesiones terminadas</span></div></div>
    {error && <p className="study-error" role="alert">{error}</p>}
    {loading || !session ? <p className="study-empty" role="status">Abriendo tu espacio de escritura…</p> : <div className="activity-layout">
      <section className="activity-panel writing-panel" aria-labelledby="writing-prompt-title">
        <p className="eyebrow">DESAFÍO B1–B2</p><h2 id="writing-prompt-title">Una experiencia que te hizo crecer</h2>
        <p className="writing-prompt">{session.prompt}</p>
        <label htmlFor="writing-text">Tu texto en inglés</label>
        <textarea id="writing-text" value={session.text} onChange={(event) => editText(event.target.value)} disabled={!!session.completedAt || busy} placeholder="Start with one idea, then add an example…" rows={12} maxLength={5000} />
        <div className="writing-meta"><span>{wordCount} palabras · sugeridas: 120–180</span><span role="status">{saveStatus}</span></div>
        {session.completedAt ? <div className="activity-actions"><button className="primary-button" type="button" onClick={() => { setSession(newWritingSession()); setSaveStatus(''); setError('') }}>Nueva sesión →</button></div> : <>
          <div className="activity-actions">{aiConfigured && <button className="secondary-button" type="button" disabled={busy || session.text.trim().length < 40} onClick={() => void requestFeedback()}>{busy ? 'Consultando IA…' : 'Pedir comentarios con IA'}</button>}<button className="primary-button" type="button" disabled={busy || session.text.trim().length < 40} onClick={() => void finish()}>{busy ? 'Guardando…' : 'Finalizar sesión →'}</button></div>
          <p className="offline-note">{aiConfigured ? 'Solo al pedir comentarios se envía tu texto a Supabase y Gemini. También podés finalizar sin IA.' : 'La IA no está configurada. Tu borrador y sesión se guardan localmente; no hay corrección automática sin conexión.'}</p>
        </>}
        {session.feedback && <div className="writing-feedback" aria-label="Comentarios de escritura"><p className="eyebrow">COMENTARIOS DE IA</p><h3>Una forma de mejorar tu texto</h3><p>{session.feedback.feedback}</p><strong>Texto sugerido</strong><blockquote>{session.feedback.correctedText}</blockquote><strong>Próximos ajustes</strong><ul>{session.feedback.suggestions.map((suggestion, index) => <li key={index}>{suggestion}</li>)}</ul></div>}
      </section>
      <aside className="activity-panel" aria-label="Historial de escritura"><p className="eyebrow">TU HISTORIAL LOCAL</p><h2>Textos terminados</h2>{history.length ? <ul className="activity-history">{history.slice(0, 5).map((item) => <li key={item.id}><strong>{item.text.trim().split(/\s+/).length} palabras</strong><span>{item.completedAt?.toLocaleDateString('es')} · {item.feedback ? 'Con comentarios de IA' : 'Sin comentarios automáticos'}</span></li>)}</ul> : <p>Tu primera sesión terminada va a aparecer acá. Podés volver al borrador cuando quieras.</p>}</aside>
    </div>}
  </section>
}

export function ProgressDashboard({ onNavigate }: { onNavigate: (section: 'Tarjetas' | 'Quiz' | 'Writing') => void }) {
  const [cards, setCards] = useState<StudyCard[]>([])
  const [reviews, setReviews] = useState<ReviewLog[]>([])
  const [quizzes, setQuizzes] = useState<QuizAttempt[]>([])
  const [writing, setWriting] = useState<WritingSession[]>([])
  const [activity, setActivity] = useState<StudyActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void (async () => {
        await seedCardsIfEmpty()
        const [nextCards, nextReviews, nextQuizzes, nextWriting, nextActivity] = await Promise.all([
          getStudyCards(), getReviewHistory(), getQuizAttempts(), getWritingSessions(), getActivityHistory(),
        ])
        setCards(nextCards); setReviews(nextReviews); setQuizzes(nextQuizzes); setWriting(nextWriting)
        setActivity(nextActivity)
      })().catch(() => setError('No pudimos calcular tu progreso local. Revisá el almacenamiento del navegador.'))
        .finally(() => setLoading(false))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const progress = calculateProgress(cards, reviews, quizzes, writing, new Date(), activity)
  const nextSection = progress.dueCount ? 'Tarjetas' : !progress.quizCompletions ? 'Quiz' : 'Writing'
  const nextAction = progress.dueCount ? `Tenés ${progress.dueCount} tarjetas listas para repasar.` : !progress.quizCompletions ? 'Probá un quiz con tus tarjetas.' : 'Dale espacio a una sesión de escritura.'

  return <section className="study-page activity-page" aria-labelledby="module-title">
    <div className="study-page-heading"><div><p className="eyebrow">TU CAMINO HACIA B2</p><h1 id="module-title">Cada práctica deja huella.</h1><p className="module-description">Este resumen usa solo lo que guardaste en este dispositivo. No representa una evaluación oficial de nivel.</p></div></div>
    {error && <p className="study-error" role="alert">{error}</p>}
    {loading ? <p className="study-empty" role="status">Calculando tu progreso…</p> : <>
      <div className="progress-metrics" aria-label="Estadísticas de estudio">
        <div><strong>{progress.cardCount}</strong><span>tarjetas guardadas</span></div><div><strong>{progress.quizCompletions}</strong><span>quizzes completados</span></div><div><strong>{progress.writingSessions}</strong><span>sesiones de escritura</span></div><div><strong>{progress.streakDays}</strong><span>{progress.streakDays === 1 ? 'día de racha' : 'días de racha'}</span></div>
      </div>
      <div className="activity-layout">
        <section className="activity-panel" aria-labelledby="b2-goal-title"><p className="eyebrow">META PERSONAL B2</p><h2 id="b2-goal-title">{progress.masteredCount} de {MASTERED_CARD_GOAL} tarjetas consolidadas</h2><div className="goal-track" role="progressbar" aria-label="Meta de tarjetas consolidadas" aria-valuenow={Math.min(progress.masteredCount, MASTERED_CARD_GOAL)} aria-valuemin={0} aria-valuemax={MASTERED_CARD_GOAL}><span style={{ width: `${progress.goalPercent}%` }} /></div><p>{progress.goalPercent}% de tu meta. Una tarjeta cuenta como consolidada tras cinco repasos exitosos y si sigue activa. Es una meta de práctica, no una certificación B2.</p></section>
        <section className="activity-panel" aria-labelledby="next-action-title"><p className="eyebrow">TU PRÓXIMO PASO</p><h2 id="next-action-title">Seguí a tu ritmo.</h2><p>{nextAction}</p><button className="primary-button" type="button" onClick={() => onNavigate(nextSection)}>Ir a {nextSection} →</button><p className="offline-note">La racha cuenta días con repasos, quizzes terminados o escritura finalizada; un borrador no cuenta.</p></section>
      </div>
      <section className="activity-panel progress-activity" aria-labelledby="recent-activity-title">
        <div className="progress-activity-heading"><div><p className="eyebrow">TU HISTORIAL LOCAL</p><h2 id="recent-activity-title">Actividad reciente</h2></div><p>{progress.activityByPeriod.last7Days} esta semana · {progress.activityByPeriod.last30Days} en 30 días</p></div>
        <div className="activity-segments" aria-label="Actividad por tipo">{[
          ['Tarjetas nuevas', progress.activityByType.card_created], ['Repasos', progress.activityByType.review],
          ['Lotes desde notas', progress.activityByType.candidate_batch_confirmed], ['Quizzes', progress.activityByType.quiz_completed],
          ['Writing', progress.activityByType.writing_completed],
        ].map(([label, count]) => <span key={label}>{label}: <strong>{count}</strong></span>)}</div>
        {progress.recentActivity.length ? <ol className="recent-activity">{progress.recentActivity.map((item) => <li key={item.id}><span>{item.summary}</span><time dateTime={item.occurredAt.toISOString()}>{item.occurredAt.toLocaleDateString('es', { day: 'numeric', month: 'short' })} · {item.occurredAt.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</time></li>)}</ol> : <p>Todavía no hay actividad registrada. Tus próximas prácticas aparecerán acá.</p>}
      </section>
    </>}
  </section>
}
