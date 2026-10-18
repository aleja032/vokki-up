import { useEffect, useState } from 'react'
import { useRegisterSW } from 'virtual:pwa-register/react'
import { confirmStudyNoteCandidates, deleteStudyNote, getReviewHistory, getStudyCards, getStudyNotes, reviewStudyCard, saveStudyCard, saveStudyNote, seedCardsIfEmpty, updateStudyNote } from './lib/studyDb'
import { createVocabularyCandidate } from './lib/vocabulary'
import { getConfiguredGeminiClient, getGeminiClientConfig } from './lib/geminiClient'
import { visibleExtractionStatus, type ExtractionStatus } from './lib/extractionStatus'
import { ProgressDashboard, QuizPractice, WritingPractice } from './lib/studyModules'
import { getConfiguredSupabaseClient, getSupabasePublicConfig } from './lib/supabaseClient'
import { syncStudyData } from './lib/studySync'
import type { ReviewLog, StudyCard, StudyNote, StudyRating, VocabularyCandidate } from './types/study'
import { CardEditorView, CardLibraryView, CardReviewView } from './features/cards/CardViews'
import './App.css'

type Section = 'Inicio' | 'Notas' | 'Tarjetas' | 'Quiz' | 'Writing' | 'Progreso'
type Theme = 'light' | 'dark'
type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const sections: { name: Section; icon: string }[] = [
  { name: 'Inicio', icon: '⌂' },
  { name: 'Notas', icon: '▤' },
  { name: 'Tarjetas', icon: '▧' },
  { name: 'Quiz', icon: '✳' },
  { name: 'Writing', icon: '✎' },
  { name: 'Progreso', icon: '↗' },
]

function readSavedTheme(): Theme {
  try {
    return window.localStorage.getItem('vokki-theme') === 'dark' ? 'dark' : 'light'
  } catch {
    return 'light'
  }
}

function PwaStatus() {
  const [hasController, setHasController] = useState(() => Boolean(navigator.serviceWorker?.controller))
  const [isOffline, setIsOffline] = useState(() => !navigator.onLine)
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null)
  const [installError, setInstallError] = useState(false)
  const [registrationError, setRegistrationError] = useState(false)
  const [isStandalone, setIsStandalone] = useState(() => window.matchMedia('(display-mode: standalone)').matches || 'standalone' in navigator && navigator.standalone === true)
  const { offlineReady: [offlineReady] } = useRegisterSW({
    immediate: true,
    onRegisterError: () => setRegistrationError(true),
  })

  useEffect(() => {
    const updateController = () => setHasController(Boolean(navigator.serviceWorker?.controller))
    const updateConnection = () => setIsOffline(!navigator.onLine)
    const updateDisplayMode = () => setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || 'standalone' in navigator && navigator.standalone === true)
    const captureInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }
    const installed = () => {
      setInstallPrompt(null)
      setIsStandalone(true)
    }
    const displayMode = window.matchMedia('(display-mode: standalone)')
    navigator.serviceWorker?.addEventListener('controllerchange', updateController)
    window.addEventListener('online', updateConnection)
    window.addEventListener('offline', updateConnection)
    window.addEventListener('beforeinstallprompt', captureInstallPrompt)
    window.addEventListener('appinstalled', installed)
    displayMode.addEventListener('change', updateDisplayMode)
    return () => {
      navigator.serviceWorker?.removeEventListener('controllerchange', updateController)
      window.removeEventListener('online', updateConnection)
      window.removeEventListener('offline', updateConnection)
      window.removeEventListener('beforeinstallprompt', captureInstallPrompt)
      window.removeEventListener('appinstalled', installed)
      displayMode.removeEventListener('change', updateDisplayMode)
    }
  }, [])

  const install = async () => {
    if (!installPrompt) return
    try {
      await installPrompt.prompt()
      await installPrompt.userChoice
      setInstallPrompt(null)
      setInstallError(false)
    } catch {
      setInstallError(true)
    }
  }

  const shellReady = offlineReady || hasController
  const canPrepareOffline = window.isSecureContext && 'serviceWorker' in navigator
  const isAppleMobile = /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1

  if (import.meta.env.DEV) return null

  return (
    <section className="pwa-status" aria-label="Instalación y uso sin conexión">
      <div className="pwa-status-copy" role="status" aria-live="polite">
        <strong>{shellReady ? 'App lista para abrir sin conexión' : registrationError || !canPrepareOffline ? 'Acceso sin conexión no disponible' : 'Preparando el acceso sin conexión'}</strong>
        <span>{shellReady
          ? 'La app está guardada en este navegador y se actualiza automáticamente. Tus notas y prácticas se guardan localmente; no borres los datos del sitio.'
          : registrationError || !canPrepareOffline
            ? 'Podés seguir estudiando mientras esta página esté abierta. Revisá la configuración del navegador antes de desconectarte.'
            : 'Mantené esta página abierta y conectada hasta que termine la descarga de la app.'}</span>
        {isOffline && <span className="pwa-offline">El navegador informa que estás sin conexión.</span>}
        {installError && <span>El navegador no pudo abrir la instalación. Probá desde su menú.</span>}
      </div>
      {!isStandalone && (
        <div className="pwa-install">
          {installPrompt ? <button className="secondary-button" type="button" onClick={() => void install()}>Instalar Vokki Up</button>
            : <span>{isAppleMobile ? 'En iPhone o iPad: Compartir → Agregar a pantalla de inicio.' : 'Si tu navegador lo permite, instalá la app desde su menú.'}</span>}
        </div>
      )}
    </section>
  )
}

function SyncStatus() {
  const [status, setStatus] = useState('Tus datos de estudio se guardan en este dispositivo. La sincronización es opcional y solo comienza cuando la pedís.')
  const [busy, setBusy] = useState(false)
  const configured = Boolean(getSupabasePublicConfig())

  const synchronize = async () => {
    const client = getConfiguredSupabaseClient()
    if (!client || busy) return
    setBusy(true)
    setStatus('Conectando y conciliando tus datos…')
    try {
      const { data: sessionData, error: sessionError } = await client.auth.getSession()
      if (sessionError) throw sessionError
      if (!sessionData.session) {
        const { error: signInError } = await client.auth.signInAnonymously()
        if (signInError) throw new Error('El ingreso anónimo no está disponible en este proyecto. Tus datos siguen guardados localmente.')
      }
      const { data: userData, error: userError } = await client.auth.getUser()
      if (userError || !userData.user) throw new Error('No pudimos confirmar tu sesión. Tus datos siguen guardados localmente.')
      const count = await syncStudyData(client, userData.user.id)
      setStatus(`Sincronización completada: ${count} registros conciliados. Las imágenes adjuntas permanecen solo en este dispositivo.`)
    } catch (error) {
      setStatus(error instanceof Error && error.message.startsWith('El ingreso anónimo') ? error.message : 'No pudimos completar la sincronización. Tus datos locales no se borraron; probá de nuevo cuando el servicio esté disponible.')
    } finally {
      setBusy(false)
    }
  }

  return <section className="sync-status" aria-label="Sincronización opcional">
    <div><strong>Sincronización opcional</strong><p role="status" aria-live="polite">{configured ? status : 'No está configurada. Tus datos siguen guardados en este dispositivo.'}</p></div>
    {configured && <button className="secondary-button" type="button" onClick={() => void synchronize()} disabled={busy || !navigator.onLine}>{busy ? 'Sincronizando…' : 'Sincronizar ahora'}</button>}
  </section>
}

function StudyCards() {
  const [cards, setCards] = useState<StudyCard[]>([])
  const [history, setHistory] = useState<ReviewLog[]>([])
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [note, setNote] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [reviewingId, setReviewingId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<'review' | 'create' | 'library'>('review')

  const refresh = async () => {
    await seedCardsIfEmpty()
    const [nextCards, nextHistory] = await Promise.all([getStudyCards(), getReviewHistory()])
    setCards(nextCards)
    setHistory(nextHistory)
    setReviewingId((current) => current && nextCards.some((card) => card.id === current && !card.suspended && card.nextReviewAt <= new Date())
      ? current
      : nextCards.find((card) => !card.suspended && card.nextReviewAt <= new Date())?.id ?? null)
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh().catch(() => setError('No pudimos abrir tu biblioteca local. Revisá el almacenamiento del navegador y volvé a intentar.'))
        .finally(() => setLoading(false))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])

  const clearForm = () => {
    setFront('')
    setBack('')
    setNote('')
    setEditingId(null)
  }

  const saveCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const existing = cards.find((card) => card.id === editingId)
    const timestamp = new Date()
    try {
      await saveStudyCard({
        id: existing?.id ?? crypto.randomUUID(),
        front: front.trim(),
        back: back.trim(),
        note: note.trim(),
        createdAt: existing?.createdAt ?? timestamp,
        updatedAt: timestamp,
        state: existing?.state ?? 'new',
        nextReviewAt: existing?.nextReviewAt ?? new Date(0),
        intervalMinutes: existing?.intervalMinutes ?? 0,
        easeFactor: existing?.easeFactor ?? 2.5,
        repetitions: existing?.repetitions ?? 0,
        suspended: existing?.suspended ?? false,
      })
      clearForm()
      setError('')
      await refresh()
    } catch {
      setError('No se pudo guardar la tarjeta. Tus cambios anteriores siguen intactos.')
    }
  }

  const toggleSuspended = async (card: StudyCard) => {
    try {
      await saveStudyCard({ ...card, suspended: !card.suspended })
      await refresh()
    } catch {
      setError('No se pudo actualizar el estado de la tarjeta.')
    }
  }

  const dueCards = cards.filter((card) => !card.suspended && card.nextReviewAt <= new Date())
  const currentCard = dueCards.find((card) => card.id === reviewingId) ?? dueCards[0]
  const review = async (rating: StudyRating) => {
    if (!currentCard) return
    try {
      await reviewStudyCard(currentCard.id, rating)
      setRevealed(false)
      setError('')
      await refresh()
    } catch {
      setError('No se pudo registrar el repaso. Probá de nuevo; la tarjeta no se perdió.')
    }
  }

  const editCard = (card: StudyCard) => {
    setEditingId(card.id)
    setFront(card.front)
    setBack(card.back)
    setNote(card.note)
    setActiveView('create')
    setActiveView('create')
  }

  return (
    <section className="study-page" aria-labelledby="module-title">
      <div className="study-page-heading">
        <div>
          <p className="eyebrow">REPASO INTELIGENTE</p>
          <h1 id="module-title">Tus tarjetas, a tu ritmo.</h1>
          <p className="module-description">Creá vocabulario y repasalo cuando toque. Todo queda guardado en este dispositivo.</p>
        </div>
        <div className="study-stats"><strong>{dueCards.length}</strong><span>para repasar hoy</span></div>
      </div>

      {error && <p className="study-error" role="alert">{error}</p>}
      {loading ? <p className="study-empty" role="status">Abriendo tu biblioteca…</p> : (
        <>
          <nav className="card-flow-nav" aria-label="Flujos de tarjetas">
            <button type="button" aria-current={activeView === 'review' ? 'page' : undefined} className={activeView === 'review' ? 'is-active' : ''} onClick={() => setActiveView('review')}>Repasar <span>{dueCards.length}</span></button>
            <button type="button" aria-current={activeView === 'create' ? 'page' : undefined} className={activeView === 'create' ? 'is-active' : ''} onClick={() => { clearForm(); setActiveView('create') }}>Crear tarjeta <span aria-hidden="true">+</span></button>
            <button type="button" aria-current={activeView === 'library' ? 'page' : undefined} className={activeView === 'library' ? 'is-active' : ''} onClick={() => setActiveView('library')}>Biblioteca <span>{cards.length}</span></button>
          </nav>
          {activeView === 'review' && <CardReviewView card={currentCard} dueCount={dueCards.length} reviewCount={history.length} revealed={revealed} onReveal={() => setRevealed(true)} onRate={(rating) => void review(rating)} />}
          {activeView === 'create' && <CardEditorView front={front} back={back} note={note} editing={Boolean(editingId)} onFrontChange={setFront} onBackChange={setBack} onNoteChange={setNote} onSubmit={(event) => void saveCard(event)} onCancel={clearForm} />}
          {activeView === 'library' && <CardLibraryView cards={cards} onEdit={editCard} onToggleSuspended={(card) => void toggleSuspended(card)} />}
        </>
      )}
    </section>
  )
}

function NotesCapture() {
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null)
  const [selectedCandidateIds, setSelectedCandidateIds] = useState<string[]>([])
  const [confirmingCandidates, setConfirmingCandidates] = useState(false)
  const [word, setWord] = useState('')
  const [meaning, setMeaning] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [savedImageUrl, setSavedImageUrl] = useState('')
  const [extractingNoteId, setExtractingNoteId] = useState<string | null>(null)
  const [extractionStatus, setExtractionStatus] = useState<ExtractionStatus | null>(null)
  const aiConfigured = getGeminiClientConfig() !== null

  const refresh = async () => setNotes(await getStudyNotes())
  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refresh().catch(() => setError('No pudimos abrir tus notas locales. Revisá el almacenamiento del navegador.'))
    }, 0)
    return () => window.clearTimeout(timer)
  }, [])
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  const selectImage = (file?: File) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Elegí un archivo de imagen para adjuntarlo.')
      return
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('La imagen supera 8 MB. Elegí una más liviana para guardarla en este dispositivo.')
      return
    }
    setError('')
    setAttachment(file)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const saveNote = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const now = new Date()
    const note: StudyNote = {
      id: crypto.randomUUID(), title: title.trim() || 'Nota sin título', body: body.trim(),
      createdAt: now, updatedAt: now, candidates: [],
      ...(attachment ? { attachment: { name: attachment.name, type: attachment.type, blob: attachment } } : {}),
    }
    try {
      await saveStudyNote(note)
      await refresh()
      setActiveNoteId(note.id)
      setTitle('')
      setBody('')
      setAttachment(null)
      setPreviewUrl('')
      setNotice(attachment
        ? 'Nota e imagen guardadas en este dispositivo. Todavía no se extrajeron palabras de la imagen.'
        : 'Nota guardada en este dispositivo y disponible sin conexión.')
      setError('')
    } catch {
      setError('No se pudo guardar la nota. El texto y la imagen siguen en el formulario para que puedas intentar de nuevo.')
    }
  }

  const activeNote = notes.find((note) => note.id === activeNoteId) ?? notes[0]
  useEffect(() => {
    let imageUrl = ''
    const timer = window.setTimeout(() => {
      if (activeNote?.attachment) {
        imageUrl = URL.createObjectURL(activeNote.attachment.blob)
        setSavedImageUrl(imageUrl)
      } else {
        setSavedImageUrl('')
      }
    }, 0)
    return () => {
      window.clearTimeout(timer)
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [activeNote?.id, activeNote?.attachment])

  const mutateNote = async (noteId: string, update: (current: StudyNote) => StudyNote, reportError = true) => {
    try {
      await updateStudyNote(noteId, update)
      await refresh()
      if (reportError) setError('')
      return true
    } catch {
      if (reportError) setError('No se pudo actualizar la nota. Probá de nuevo; el contenido guardado sigue intacto.')
      return false
    }
  }
  const addCandidate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!activeNote) return
    const candidate = createVocabularyCandidate(word, meaning)
    if (!candidate) return
    await mutateNote(activeNote.id, (current) => ({ ...current, candidates: [...current.candidates, candidate] }))
    setWord('')
    setMeaning('')
    setNotice('Palabra agregada para revisar. Todavía no es una tarjeta.')
  }
  const extractImageWords = async () => {
    if (!activeNote?.attachment || extractingNoteId !== null) return
    const client = getConfiguredGeminiClient()
    if (!client) return
    const sourceNote = activeNote
    const sourceNoteId = sourceNote.id
    const sourceAttachment = activeNote.attachment
    setExtractionStatus(null)
    setExtractingNoteId(sourceNoteId)
    try {
      const result = await client.extractImageVocabulary(sourceAttachment.blob, sourceNote.body)
      const existing = new Set(sourceNote.candidates.map((candidate) => (candidate.canonicalWord ?? candidate.word).trim().toLocaleLowerCase()))
      const candidates = result.words
        .map(({ originalInput, canonicalWord, meaning: candidateMeaning, phonetic }) => createVocabularyCandidate(canonicalWord, candidateMeaning, { originalInput, canonicalWord, phonetic }))
        .filter((candidate): candidate is VocabularyCandidate => {
          if (!candidate || existing.has(candidate.word.trim().toLocaleLowerCase())) return false
          existing.add(candidate.word.trim().toLocaleLowerCase())
          return true
        })
      if (!candidates.length) {
        setExtractionStatus({ noteId: sourceNoteId, kind: 'notice', message: 'No encontramos palabras nuevas para revisar. Podés agregarlas manualmente abajo.' })
        return
      }
      const saved = await mutateNote(sourceNoteId, (current) => ({ ...current, candidates: [...current.candidates, ...candidates] }), false)
      if (!saved) {
        setExtractionStatus({ noteId: sourceNoteId, kind: 'error', message: 'No se pudieron guardar las sugerencias. Probá de nuevo o agregalas manualmente.' })
        return
      }
      setExtractionStatus({ noteId: sourceNoteId, kind: 'notice', message: `${candidates.length} ${candidates.length === 1 ? 'palabra sugerida' : 'palabras sugeridas'} para revisar. Seleccioná las que quieras confirmar en grupo.` })
    } catch (cause) {
      setExtractionStatus({ noteId: sourceNoteId, kind: 'error', message: cause instanceof Error ? cause.message : 'No se pudieron extraer palabras. Probá de nuevo o agregalas manualmente.' })
    } finally {
      setExtractingNoteId(null)
    }
  }
  const editCandidate = (candidate: VocabularyCandidate, field: 'word' | 'meaning' | 'phonetic', value: string) => {
    if (!activeNote) return
    void mutateNote(activeNote.id, (current) => ({
      ...current,
      candidates: current.candidates.map((item) => item.id === candidate.id ? { ...item, [field]: value, ...(field === 'word' ? { canonicalWord: value } : {}) } : item),
    }))
  }
  const rejectCandidate = (candidateId: string) => {
    if (!activeNote) return
    setSelectedCandidateIds((current) => current.filter((id) => id !== candidateId))
    void mutateNote(activeNote.id, (current) => ({
      ...current,
      candidates: current.candidates.map((candidate) => candidate.id === candidateId ? { ...candidate, status: 'rejected' } : candidate),
    }))
  }
  const toggleCandidateSelection = (candidateId: string) => {
    setSelectedCandidateIds((current) => current.includes(candidateId) ? current.filter((id) => id !== candidateId) : [...current, candidateId])
  }
  const confirmSelectedCandidates = async () => {
    if (!activeNote) return
    const selected = selectedCandidateIds
    if (!selected.length || confirmingCandidates) return
    setConfirmingCandidates(true)
    try {
      const cards = await confirmStudyNoteCandidates(activeNote.id, selected)
      await refresh()
      setSelectedCandidateIds([])
      setNotice(cards.length ? `${cards.length} ${cards.length === 1 ? 'tarjeta creada' : 'tarjetas creadas'} en tu biblioteca.` : 'Las palabras seleccionadas ya estaban confirmadas o duplicaban una tarjeta existente.')
      setError('')
    } catch {
      setError('No se pudo confirmar el grupo. No se creó ninguna tarjeta y las palabras siguen disponibles para revisar.')
    } finally {
      setConfirmingCandidates(false)
    }
  }
  const removeNote = async (note: StudyNote) => {
    try {
      await deleteStudyNote(note.id)
      await refresh()
      setActiveNoteId(null)
      setNotice('Nota eliminada del dispositivo.')
    } catch {
      setError('No se pudo eliminar la nota.')
    }
  }

  return (
    <section className="study-page notes-page" aria-labelledby="module-title">
      <div className="study-page-heading">
        <div><p className="eyebrow">CAPTURÁ LO QUE TE INSPIRA</p><h1 id="module-title">Una idea, una palabra nueva.</h1><p className="module-description">Escribí una nota o guardá una imagen para volver a ella cuando quieras. Todo queda en este dispositivo.</p></div>
        <div className="study-stats"><strong>{notes.length}</strong><span>notas guardadas</span></div>
      </div>
      {error && <p className="study-error" role="alert">{error}</p>}
      {notice && <p className="notes-notice" role="status">{notice}</p>}
      <div className="notes-layout">
        <section className="note-composer" aria-labelledby="note-composer-title">
          <div className="notes-section-heading"><div><p className="eyebrow">CAPTURA RÁPIDA</p><h2 id="note-composer-title">Nueva nota</h2></div><span className="notes-offline-badge"><span aria-hidden="true">●</span> Funciona sin conexión</span></div>
          <form onSubmit={(event) => void saveNote(event)}>
            <label htmlFor="note-title">Título <span>(opcional)</span></label>
            <input id="note-title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Una frase que quieras recordar" maxLength={100} />
            <label htmlFor="note-body">Tu nota</label>
            <textarea id="note-body" value={body} onChange={(event) => setBody(event.target.value)} placeholder="Escribí una palabra, una frase o el contexto donde la encontraste…" rows={6} maxLength={5000} />
            <div className="image-capture">
              <div><strong>Sumá una imagen</strong><small>La imagen se guarda localmente. La extracción opcional necesita conexión y configuración de Supabase.</small></div>
              <div className="image-actions">
                <input id="note-image-file" className="visually-hidden" type="file" accept="image/*" onChange={(event) => selectImage(event.target.files?.[0])} />
                <label className="image-picker" htmlFor="note-image-file">Elegir imagen</label>
                <input id="note-image-camera" className="visually-hidden" type="file" accept="image/*" capture="environment" onChange={(event) => selectImage(event.target.files?.[0])} />
                <label className="image-picker image-picker-secondary" htmlFor="note-image-camera">Usar cámara</label>
              </div>
              {attachment && previewUrl && <div className="image-preview"><img src={previewUrl} alt={`Vista previa: ${attachment.name}`} /><div><strong>{attachment.name}</strong><small>Lista para adjuntar a la nota</small></div><button type="button" className="remove-image" onClick={() => { setAttachment(null); setPreviewUrl('') }}>Quitar imagen</button></div>}
            </div>
            <button className="primary-button" type="submit" disabled={!body.trim() && !attachment}>Guardar nota <span aria-hidden="true">→</span></button>
          </form>
        </section>

        <section className="notes-library" aria-labelledby="notes-library-title">
              <div className="notes-section-heading"><div><p className="eyebrow">TU COLECCIÓN</p><h2 id="notes-library-title">Notas guardadas</h2></div><span className="library-count">{notes.length}</span></div>
          {notes.length === 0 ? <div className="notes-empty"><span aria-hidden="true">✦</span><strong>Tu próxima palabra empieza acá.</strong><p>Las notas nuevas van a quedar guardadas para que puedas volver a ellas sin conexión.</p></div> : <ul className="notes-list">{notes.map((note) => <li key={note.id} className={activeNote?.id === note.id ? 'is-selected' : ''}><button type="button" className="note-select" onClick={() => { setActiveNoteId(note.id); setSelectedCandidateIds([]); setNotice('') }}><strong>{note.title}</strong><span>{note.body || 'Imagen adjunta'}</span><small>{note.createdAt.toLocaleDateString('es')} {note.attachment ? '· Con imagen' : ''}</small></button><button type="button" className="note-delete" aria-label={`Eliminar nota ${note.title}`} onClick={() => void removeNote(note)}>×</button></li>)}</ul>}
          {activeNote && <section className="candidate-review" aria-labelledby="candidate-review-title">
            <div className="candidate-heading"><div><p className="eyebrow">REVISIÓN MANUAL</p><h3 id="candidate-review-title">Palabras de “{activeNote.title}”</h3></div><span className="review-count">{activeNote.candidates.filter((candidate) => candidate.status === 'pending').length} por revisar</span></div>
            <ol className="candidate-flow-steps" aria-label="Pasos para crear tarjetas">
              <li><strong>Guardá una nota</strong><span>Escribí una frase o sumá una imagen.</span></li>
              <li><strong>Revisá y seleccioná</strong><span>Corregí los datos y marcá las palabras que querés guardar.</span></li>
              <li><strong>Creá tus tarjetas</strong><span>Confirmá la selección cuando esté lista.</span></li>
            </ol>
            {activeNote.attachment && <div className="image-extraction-note"><p>La imagen está guardada localmente. {aiConfigured ? 'Solo al tocar el botón se envía una copia de la foto y, si esta nota tiene texto, también ese texto como contexto a Supabase y Gemini para sugerir palabras. Revisalas antes de crear tarjetas.' : 'La extracción asistida no está configurada. Podés seguir agregando palabras manualmente; configurar Supabase es opcional.'}</p>{aiConfigured && <button type="button" className="candidate-add" onClick={() => void extractImageWords()} disabled={extractingNoteId !== null} aria-busy={extractingNoteId === activeNote.id}>{extractingNoteId === activeNote.id ? 'Analizando imagen…' : extractingNoteId !== null ? 'Esperá: analizando otra nota…' : 'Extraer palabras para revisar'}</button>}{visibleExtractionStatus(extractionStatus, activeNote.id) && <p role={extractionStatus?.kind === 'error' ? 'alert' : 'status'}>{extractionStatus?.message}</p>}</div>}
            {activeNote.attachment && savedImageUrl && <figure className="saved-note-image"><img src={savedImageUrl} alt={`Imagen adjunta a ${activeNote.title}`} /><figcaption><span>{activeNote.attachment.name}</span><a href={savedImageUrl} target="_blank" rel="noreferrer">Abrir imagen en tamaño completo</a></figcaption></figure>}
            <form className="candidate-form" onSubmit={(event) => void addCandidate(event)}>
              <label htmlFor="candidate-word">Palabra o frase en inglés</label><input id="candidate-word" value={word} onChange={(event) => setWord(event.target.value)} placeholder="e.g. take your time" maxLength={120} required />
              <label htmlFor="candidate-meaning">Significado en español</label><input id="candidate-meaning" value={meaning} onChange={(event) => setMeaning(event.target.value)} placeholder="Tomate tu tiempo" maxLength={180} />
              <button type="submit" className="candidate-add">Agregar para revisar <span aria-hidden="true">+</span></button>
            </form>
            {activeNote.candidates.length === 0 ? <p className="candidate-empty">Todavía no hay palabras. Agregá las que quieras convertir en tarjetas.</p> : <ul className="candidate-list">{activeNote.candidates.map((candidate) => <li key={candidate.id} className={`candidate-item candidate-${candidate.status}`}>
              {candidate.status === 'pending' && <label className="candidate-select"><input type="checkbox" checked={selectedCandidateIds.includes(candidate.id)} onChange={() => toggleCandidateSelection(candidate.id)} /> Seleccionar</label>}
              <div className="candidate-fields"><label htmlFor={`candidate-word-${candidate.id}`}>Inglés corregido</label><input id={`candidate-word-${candidate.id}`} value={candidate.canonicalWord ?? candidate.word} disabled={candidate.status !== 'pending'} onChange={(event) => editCandidate(candidate, 'word', event.target.value)} />{candidate.originalInput && candidate.originalInput.trim().toLocaleLowerCase() !== (candidate.canonicalWord ?? candidate.word).trim().toLocaleLowerCase() && <><span className="candidate-original-label">Entrada original</span><span className="candidate-original">{candidate.originalInput}</span></>}<label htmlFor={`candidate-meaning-${candidate.id}`}>Significado</label><input id={`candidate-meaning-${candidate.id}`} value={candidate.meaning} disabled={candidate.status !== 'pending'} onChange={(event) => editCandidate(candidate, 'meaning', event.target.value)} /><label htmlFor={`candidate-phonetic-${candidate.id}`}>Pronunciación</label><input id={`candidate-phonetic-${candidate.id}`} value={candidate.phonetic ?? ''} placeholder="/ˈbrɪdʒ/" disabled={candidate.status !== 'pending'} onChange={(event) => editCandidate(candidate, 'phonetic', event.target.value)} /></div>
              {candidate.status === 'pending' ? <div className="candidate-actions"><button type="button" className="reject-candidate" onClick={() => rejectCandidate(candidate.id)}>Descartar</button></div> : <span className="candidate-status">{candidate.status === 'confirmed' ? 'Guardada en tarjetas' : 'Descartada'}</span>}
            </li>)}</ul>}
            {activeNote.candidates.some((candidate) => candidate.status === 'pending') && <div className="candidate-batch-actions"><span>{selectedCandidateIds.length} seleccionadas</span><button type="button" className="confirm-candidate" disabled={!selectedCandidateIds.length || confirmingCandidates} onClick={() => void confirmSelectedCandidates()}>{confirmingCandidates ? 'Guardando…' : 'Confirmar selección y crear tarjetas'}</button></div>}
          </section>}
        </section>
      </div>
    </section>
  )
}

function App() {
  const [activeSection, setActiveSection] = useState<Section>('Inicio')
  const [theme, setTheme] = useState<Theme>(readSavedTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      window.localStorage.setItem('vokki-theme', theme)
    } catch {
      // Keep the selected theme for this visit when storage is unavailable.
    }
  }, [theme])

  const navigateTo = (section: Section) => setActiveSection(section)

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <aside className="sidebar" aria-label="Navegación principal">
        <a className="brand" href="#inicio" onClick={() => navigateTo('Inicio')} aria-label="Vokki Up, inicio">
          <span className="brand-mark" aria-hidden="true">v</span>
          <span>vokki<span className="brand-up">up</span></span>
        </a>
        <div className="sidebar-label">TU ESPACIO</div>
        <nav className="nav-list" aria-label="Secciones de estudio">
          {sections.map((section) => (
            <button
              className={`nav-item${activeSection === section.name ? ' is-active' : ''}`}
              type="button"
              key={section.name}
              aria-current={activeSection === section.name ? 'page' : undefined}
              onClick={() => navigateTo(section.name)}
            >
              <span className="nav-icon" aria-hidden="true">{section.icon}</span>
              <span>{section.name}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-note">
          <span className="note-spark" aria-hidden="true">✦</span>
          <p>Un poquito cada día<br /><strong>y vas a llegar lejos.</strong></p>
          <span className="note-doodle" aria-hidden="true">↗</span>
        </div>
        <div className="sidebar-profile">
          <span className="avatar" aria-hidden="true">✦</span>
          <span className="profile-copy"><strong>Tu espacio</strong><small>Plan personal</small></span>
          <span className="profile-dots" aria-hidden="true">···</span>
        </div>
      </aside>

      <div className="page-column">
        <header className="topbar">
          <div className="mobile-brand" aria-label="Vokki Up">vokki<span>up</span></div>
          <div className="breadcrumb"><span>Mi espacio</span><span aria-hidden="true">/</span><strong>{activeSection}</strong></div>
          <div className="topbar-actions">
            <span className="today-label"><span className="status-dot" /> Tu espacio de estudio</span>
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}
              aria-label={`Activar tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
              title={`Activar tema ${theme === 'light' ? 'oscuro' : 'claro'}`}
            >
              <span aria-hidden="true">{theme === 'light' ? '☾' : '☀'}</span>
            </button>
          </div>
        </header>

        <PwaStatus />
        <main id="main-content" tabIndex={-1}>
          {activeSection === 'Inicio' ? (
            <>
              <section className="welcome-row" aria-labelledby="welcome-title">
                <div>
                  <p className="eyebrow">{new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date()).toLocaleUpperCase('es')} <span className="eyebrow-spark">✳</span></p>
                  <h1 id="welcome-title">¡Hola! <span aria-hidden="true">✦</span></h1>
                  <p className="welcome-copy">¿Un ratito para tu inglés? Estás haciendo un gran trabajo.</p>
                </div>
                <button className="streak-pill" type="button" onClick={() => navigateTo('Progreso')}><span aria-hidden="true">↗</span><strong>Ver progreso</strong></button>
              </section>

              <section className="study-hero" aria-labelledby="study-title">
                <div className="hero-copy">
                  <p className="hero-kicker"><span className="hero-kicker-dot" /> TU MOMENTO DE HOY</p>
                  <h2 id="study-title">Un paso más<br />hacia tu <em>fluidez.</em></h2>
                  <p className="hero-description">Una sesión cortita hoy puede hacer que mañana todo te salga más fácil.</p>
                  <button className="primary-button" type="button" onClick={() => navigateTo('Tarjetas')}>
                    Empezar mi sesión <span aria-hidden="true">→</span>
                  </button>
                  <div className="session-meta"><span aria-hidden="true">◷</span> Repaso local <span className="meta-divider">·</span> a tu ritmo</div>
                </div>
                <div className="hero-art" aria-hidden="true">
                  <div className="sun-shape" />
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
                  <div className="study-card card-back"><span>EN</span><i>bright</i><small>lleno de luz</small></div>
                  <div className="study-card card-front"><span>ES</span><strong>despacio</strong><small>/ des·pa·cio /</small><b>slowly</b></div>
                  <span className="art-star star-one">✳</span><span className="art-star star-two">✦</span>
                  <span className="art-squiggle">〰</span>
                </div>
                <div className="hero-footer"><span>HECHO A TU RITMO</span><span className="hero-footer-line" /><span>01 <span className="muted-number">/ 03</span></span></div>
              </section>

              <section className="dashboard-grid" aria-label="Resumen de estudio">
                <article className="progress-card">
                  <div className="card-heading"><div><p className="eyebrow">TU CAMINO</p><h2>Vas a tu ritmo.</h2></div></div>
                  <div className="progress-content">
                    <div className="progress-text"><strong>Un paso a la vez</strong><p>Tu meta de tarjetas y tu racha se calculan con la práctica guardada en este dispositivo.</p><button className="text-button" type="button" onClick={() => navigateTo('Progreso')}>Ver mi progreso →</button></div>
                  </div>
                </article>
                <article className="quote-card">
                  <span className="quote-mark" aria-hidden="true">“</span>
                  <p className="eyebrow">UNA IDEA PARA HOY</p>
                  <blockquote>Little by little,<br />one travels far.</blockquote>
                  <p className="quote-translation">De a poquito, se llega lejos.</p>
                  <span className="quote-credit">— J. R. R. Tolkien</span>
                  <span className="quote-decoration" aria-hidden="true">✳</span>
                </article>
              </section>
              <footer className="page-footer"><span>HECHO CON CARIÑO PARA TU PRÓXIMO NIVEL</span><span>Vokki Up <b>·</b> 2026</span></footer>
            </>
          ) : activeSection === 'Tarjetas' ? (
            <StudyCards />
          ) : activeSection === 'Notas' ? (
            <NotesCapture />
          ) : activeSection === 'Quiz' ? <QuizPractice />
            : activeSection === 'Writing' ? <WritingPractice />
              : <ProgressDashboard onNavigate={navigateTo} />}
        </main>
        <SyncStatus />
      </div>

      <nav className="mobile-nav" aria-label="Navegación principal">
        {sections.filter((section) => section.name !== 'Inicio').map((section) => (
          <button
            className={`mobile-nav-item${activeSection === section.name ? ' is-active' : ''}`}
            type="button"
            key={section.name}
            aria-current={activeSection === section.name ? 'page' : undefined}
            onClick={() => navigateTo(section.name)}
          >
            <span className="mobile-nav-icon" aria-hidden="true">{section.icon}</span><span>{section.name}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

export default App
