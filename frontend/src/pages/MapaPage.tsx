import { useMemo, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import MenuPageLayout from '../components/menu/MenuPageLayout'
import {
  mockEvents,
  mockAlerts,
  getCategoryLabel,
  getCategoryColor,
} from '../mocks/eventData'

type ActiveTab = 'eventos' | 'rutas' | 'avisos'
type FilterKey = 'eventos' | 'rutas' | 'avisos'

// Mock simple de rutas (para cumplir el requerimiento de “rutas temáticas” en el mapa)
// Si ya tienes mockRutas en otro archivo, cámbialo por tu import real.
const mockRoutes = [
  {
    id: 1,
    title: 'Ruta Patrimonial',
    location: 'Centro Histórico',
    description:
      'Recorrido por puntos históricos destacados del centro de Cuenca.',
    stops: 6,
    duration: '1h 30m',
    image:
      'https://images.unsplash.com/photo-1528909514045-2fa4ac7a08ba?q=80&w=800&auto=format&fit=crop',
    category: 'cultura',
  },
  {
    id: 2,
    title: 'Ruta Gastronómica',
    location: 'El Barranco',
    description:
      'Paradas recomendadas para probar sabores tradicionales y cafés.',
    stops: 5,
    duration: '1h',
    image:
      'https://images.unsplash.com/photo-1528712306091-ed0763094c98?q=80&w=800&auto=format&fit=crop',
    category: 'gastronomia',
  },
]

export default function MapaPage() {
  const { isDark } = useTheme()

  const [selectedItem, setSelectedItem] = useState<
    | { kind: 'evento'; id: number }
    | { kind: 'aviso'; id: number }
    | { kind: 'ruta'; id: number }
    | null
  >(null)

  const [activeTab, setActiveTab] = useState<ActiveTab>('eventos')

  const [filters, setFilters] = useState<Record<FilterKey, boolean>>({
    eventos: true,
    rutas: true,
    avisos: true,
  })

  const getAlertTypeStyles = (type: string) => {
    switch (type) {
      case 'cierre':
        return 'bg-secondary-500/20 text-secondary-500 border-secondary-500/30'
      case 'desvio':
        return 'bg-accent-500/20 text-accent-500 border-accent-500/30'
      case 'congestion':
        return 'bg-primary-500/20 text-primary-500 border-primary-500/30'
      default:
        return 'bg-surface-500/20 text-surface-500 border-surface-500/30'
    }
  }

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'cierre':
        return '🚫 Cierre'
      case 'desvio':
        return '↪️ Desvío'
      case 'congestion':
        return '🚗 Congestión'
      default:
        return 'Aviso'
    }
  }

  // OpenStreetMap embed (demo)
  const mapBounds = '-79.02,-2.92,-78.99,-2.88'
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBounds}&layer=mapnik&marker=-2.9001,-79.0059`

  const panelBg = isDark
    ? 'bg-surface-800/90 backdrop-blur-sm border border-surface-700'
    : 'bg-white/90 backdrop-blur-sm border border-surface-200 shadow-lg'

  const textMain = isDark ? 'text-white' : 'text-surface-900'
  const textMuted = isDark ? 'text-surface-400' : 'text-surface-500'

  const selectedTitle = useMemo(() => {
    if (!selectedItem) return null
    if (selectedItem.kind === 'evento') {
      return mockEvents.find((e) => e.id === selectedItem.id)?.title ?? null
    }
    if (selectedItem.kind === 'aviso') {
      return mockAlerts.find((a) => a.id === selectedItem.id)?.title ?? null
    }
    return mockRoutes.find((r) => r.id === selectedItem.id)?.title ?? null
  }, [selectedItem])

  return (
    <MenuPageLayout title="Mapa">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">
            🗺️ Mapa Interactivo
          </h1>
          <p className="text-surface-300">
            Explora <span className="font-semibold">eventos</span>,{' '}
            <span className="font-semibold">rutas</span> y{' '}
            <span className="font-semibold">avisos viales</span> en Cuenca.
          </p>
        </div>

        {/* Guidance + Filters */}
        <div className={`mb-6 p-4 rounded-2xl ${panelBg}`}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className={`font-semibold ${textMain}`}>
                ¿Cómo usar este mapa?
              </p>
              <p className={`text-sm ${textMuted}`}>
                Toca un pin o selecciona un elemento en la lista para ver su
                detalle. Usa los filtros para reducir la información en pantalla.
              </p>
              {selectedTitle && (
                <p className={`mt-2 text-sm ${textMuted}`}>
                  Seleccionado: <span className="font-semibold">{selectedTitle}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setFilters((p) => ({ ...p, eventos: !p.eventos }))
                }
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition
                  ${
                    filters.eventos
                      ? 'bg-primary-500/15 border-primary-500/30 text-primary-500'
                      : isDark
                        ? 'bg-surface-700/40 border-surface-600 text-surface-300'
                        : 'bg-surface-50 border-surface-200 text-surface-700'
                  }`}
                aria-pressed={filters.eventos}
              >
                📍 Eventos
              </button>

              <button
                type="button"
                onClick={() => setFilters((p) => ({ ...p, rutas: !p.rutas }))}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition
                  ${
                    filters.rutas
                      ? 'bg-accent-500/15 border-accent-500/30 text-accent-500'
                      : isDark
                        ? 'bg-surface-700/40 border-surface-600 text-surface-300'
                        : 'bg-surface-50 border-surface-200 text-surface-700'
                  }`}
                aria-pressed={filters.rutas}
              >
                🧭 Rutas
              </button>

              <button
                type="button"
                onClick={() => setFilters((p) => ({ ...p, avisos: !p.avisos }))}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border transition
                  ${
                    filters.avisos
                      ? 'bg-secondary-500/15 border-secondary-500/30 text-secondary-500'
                      : isDark
                        ? 'bg-surface-700/40 border-surface-600 text-surface-300'
                        : 'bg-surface-50 border-surface-200 text-surface-700'
                  }`}
                aria-pressed={filters.avisos}
              >
                ⚠️ Avisos
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className={`lg:col-span-2 rounded-2xl overflow-hidden ${panelBg}`}>
            <div className="relative h-[500px]">
              <iframe
                title="Mapa de Cuenca"
                src={mapUrl}
                className="w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
              />

              {/* Overlay Pins */}
              <div className="absolute inset-0 pointer-events-none">
                {/* EVENT PINS */}
                {filters.eventos &&
                  mockEvents.slice(0, 5).map((event, index) => {
                    const positions = [
                      { top: '30%', left: '45%' },
                      { top: '35%', left: '50%' },
                      { top: '40%', left: '42%' },
                      { top: '45%', left: '55%' },
                      { top: '50%', left: '48%' },
                    ]
                    const pos = positions[index]
                    const isSelected =
                      selectedItem?.kind === 'evento' &&
                      selectedItem.id === event.id

                    return (
                      <button
                        key={`event-${event.id}`}
                        onClick={() => setSelectedItem({ kind: 'evento', id: event.id })}
                        style={{ top: pos.top, left: pos.left }}
                        className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2
                          transition-all duration-300 hover:scale-125 z-10
                          ${isSelected ? 'scale-125 z-20' : ''}`}
                        aria-label={`Evento: ${event.title}`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg
                          bg-gradient-to-br ${getCategoryColor(event.category)}
                          ${isSelected ? 'ring-4 ring-white/50' : ''}`}
                        >
                          📍
                        </div>
                        {/* mini label */}
                        <div
                          className={`mt-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold
                            ${isDark ? 'bg-surface-900/70 text-white' : 'bg-white/80 text-surface-900'}
                          `}
                        >
                          Evento
                        </div>
                      </button>
                    )
                  })}

                {/* ROUTE PINS */}
                {filters.rutas &&
                  mockRoutes.map((route, index) => {
                    const positions = [
                      { top: '28%', left: '58%' },
                      { top: '52%', left: '38%' },
                    ]
                    const pos = positions[index] ?? { top: '45%', left: '45%' }
                    const isSelected =
                      selectedItem?.kind === 'ruta' && selectedItem.id === route.id

                    return (
                      <button
                        key={`route-${route.id}`}
                        onClick={() => setSelectedItem({ kind: 'ruta', id: route.id })}
                        style={{ top: pos.top, left: pos.left }}
                        className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2
                          transition-all duration-300 hover:scale-125 z-10
                          ${isSelected ? 'scale-125 z-20' : ''}`}
                        aria-label={`Ruta: ${route.title}`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg
                          bg-accent-500
                          ${isSelected ? 'ring-4 ring-white/50' : ''}`}
                        >
                          🧭
                        </div>
                        <div
                          className={`mt-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold
                            ${isDark ? 'bg-surface-900/70 text-white' : 'bg-white/80 text-surface-900'}
                          `}
                        >
                          Ruta
                        </div>
                      </button>
                    )
                  })}

                {/* ALERT PINS */}
                {filters.avisos &&
                  mockAlerts.map((alert, index) => {
                    const positions = [
                      { top: '25%', left: '40%' },
                      { top: '55%', left: '60%' },
                      { top: '38%', left: '35%' },
                      { top: '60%', left: '45%' },
                    ]
                    const pos = positions[index]
                    const isSelected =
                      selectedItem?.kind === 'aviso' && selectedItem.id === alert.id

                    return (
                      <button
                        key={`alert-${alert.id}`}
                        onClick={() => setSelectedItem({ kind: 'aviso', id: alert.id })}
                        style={{ top: pos.top, left: pos.left }}
                        className={`absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2
                          transition-all duration-300 hover:scale-125 z-10
                          ${isSelected ? 'scale-125 z-20' : ''}`}
                        aria-label={`Aviso: ${alert.title}`}
                      >
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg
                          ${
                            alert.type === 'cierre'
                              ? 'bg-secondary-500'
                              : alert.type === 'desvio'
                                ? 'bg-accent-500'
                                : 'bg-primary-500'
                          }
                          ${isSelected ? 'ring-4 ring-white/50' : ''}`}
                        >
                          ⚠️
                        </div>
                        <div
                          className={`mt-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold
                            ${isDark ? 'bg-surface-900/70 text-white' : 'bg-white/80 text-surface-900'}
                          `}
                        >
                          Aviso
                        </div>
                      </button>
                    )
                  })}
              </div>

              {/* Legend */}
              <div
                className={`absolute bottom-4 left-4 p-3 rounded-xl backdrop-blur-md ${
                  isDark ? 'bg-surface-900/80' : 'bg-white/80'
                }`}
              >
                <p className={`text-xs font-semibold mb-2 ${textMain}`}>
                  Leyenda
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary-500 text-white">
                      📍
                    </span>
                    <span className={textMuted}>Eventos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent-500 text-white">
                      🧭
                    </span>
                    <span className={textMuted}>Rutas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-secondary-500 text-white">
                      ⚠️
                    </span>
                    <span className={textMuted}>Avisos viales</span>
                  </div>
                </div>
              </div>

              {/* Mini popup (cuando hay seleccionado) */}
              {selectedItem && (
                <div
                  className={`absolute top-4 right-4 w-[280px] p-4 rounded-2xl backdrop-blur-md shadow-lg
                    ${isDark ? 'bg-surface-900/80 text-white' : 'bg-white/90 text-surface-900'}
                  `}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-sm leading-snug">
                      {selectedTitle}
                    </p>
                    <button
                      type="button"
                      onClick={() => setSelectedItem(null)}
                      className={`p-2 rounded-lg ${isDark ? 'hover:bg-surface-800' : 'hover:bg-surface-100'}`}
                      aria-label="Cerrar detalle"
                    >
                      ✕
                    </button>
                  </div>

                  <p className={`mt-2 text-xs ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                    {selectedItem.kind === 'evento'
                      ? 'Evento seleccionado. Puedes ver el detalle completo o guardarlo.'
                      : selectedItem.kind === 'ruta'
                        ? 'Ruta seleccionada. Puedes ver paradas y duración.'
                        : 'Aviso seleccionado. Revisa fechas y ubicación.'}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        // Manténlo simple: el detalle grande ya aparece abajo
                        // Este botón solo refuerza acción
                        const el = document.getElementById('detalle-mapa')
                        el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition"
                    >
                      Ver detalle
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        // En esta demo no hay agenda real desde aquí, pero deja el CTA listo.
                        alert('Acción demo: guardar/seguir (pendiente de integración real).')
                      }}
                      className={`flex-1 px-3 py-2 rounded-xl text-sm font-semibold border transition
                        ${isDark ? 'border-surface-700 hover:bg-surface-800' : 'border-surface-200 hover:bg-surface-50'}`}
                    >
                      {selectedItem.kind === 'evento' ? 'Agregar' : 'Seguir'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel */}
          <div className={`lg:col-span-1 rounded-2xl overflow-hidden flex flex-col ${panelBg}`}>
            {/* Tabs */}
            <div className={`flex border-b ${isDark ? 'border-surface-700' : 'border-surface-200'}`}>
              <button
                onClick={() => setActiveTab('eventos')}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all
                  ${
                    activeTab === 'eventos'
                      ? 'text-primary-500 border-b-2 border-primary-500'
                      : isDark
                        ? 'text-surface-400 hover:text-white'
                        : 'text-surface-500 hover:text-surface-900'
                  }`}
              >
                📍 Eventos ({mockEvents.length})
              </button>

              <button
                onClick={() => setActiveTab('rutas')}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all
                  ${
                    activeTab === 'rutas'
                      ? 'text-primary-500 border-b-2 border-primary-500'
                      : isDark
                        ? 'text-surface-400 hover:text-white'
                        : 'text-surface-500 hover:text-surface-900'
                  }`}
              >
                🧭 Rutas ({mockRoutes.length})
              </button>

              <button
                onClick={() => setActiveTab('avisos')}
                className={`flex-1 py-3 px-4 text-sm font-semibold transition-all
                  ${
                    activeTab === 'avisos'
                      ? 'text-primary-500 border-b-2 border-primary-500'
                      : isDark
                        ? 'text-surface-400 hover:text-white'
                        : 'text-surface-500 hover:text-surface-900'
                  }`}
              >
                ⚠️ Avisos ({mockAlerts.length})
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[420px]">
              {activeTab === 'eventos' &&
                mockEvents.map((event) => {
                  const isSelected =
                    selectedItem?.kind === 'evento' && selectedItem.id === event.id
                  return (
                    <button
                      key={event.id}
                      onClick={() => setSelectedItem({ kind: 'evento', id: event.id })}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-300
                        ${isSelected ? 'ring-2 ring-primary-500 scale-[1.02]' : ''}
                        ${isDark ? 'bg-surface-700/50 hover:bg-surface-700' : 'bg-surface-50 hover:bg-surface-100'}`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm line-clamp-1 ${textMain}`}>
                            {event.title}
                          </h3>
                          <p className={`text-xs mt-0.5 ${textMuted}`}>
                            📍 {event.location}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium text-white
                              bg-gradient-to-r ${getCategoryColor(event.category)}`}
                          >
                            {getCategoryLabel(event.category)}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}

              {activeTab === 'rutas' &&
                mockRoutes.map((route) => {
                  const isSelected =
                    selectedItem?.kind === 'ruta' && selectedItem.id === route.id
                  return (
                    <button
                      key={route.id}
                      onClick={() => setSelectedItem({ kind: 'ruta', id: route.id })}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-300
                        ${isSelected ? 'ring-2 ring-primary-500 scale-[1.02]' : ''}
                        ${isDark ? 'bg-surface-700/50 hover:bg-surface-700' : 'bg-surface-50 hover:bg-surface-100'}`}
                    >
                      <div className="flex gap-3">
                        <img
                          src={route.image}
                          alt={route.title}
                          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm line-clamp-1 ${textMain}`}>
                            {route.title}
                          </h3>
                          <p className={`text-xs mt-0.5 ${textMuted}`}>
                            📍 {route.location} · 🧭 {route.stops} paradas · ⏱️ {route.duration}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border
                              ${isDark ? 'border-accent-500/30 text-accent-300 bg-accent-500/10' : 'border-accent-500/30 text-accent-700 bg-accent-500/10'}`}
                          >
                            Ruta temática
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}

              {activeTab === 'avisos' &&
                mockAlerts.map((alert) => {
                  const isSelected =
                    selectedItem?.kind === 'aviso' && selectedItem.id === alert.id
                  return (
                    <button
                      key={alert.id}
                      onClick={() => setSelectedItem({ kind: 'aviso', id: alert.id })}
                      className={`w-full text-left p-3 rounded-xl transition-all duration-300
                        ${isSelected ? 'ring-2 ring-primary-500 scale-[1.02]' : ''}
                        ${isDark ? 'bg-surface-700/50 hover:bg-surface-700' : 'bg-surface-50 hover:bg-surface-100'}`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border
                            ${getAlertTypeStyles(alert.type)}`}
                        >
                          {alert.type === 'cierre'
                            ? '🚫'
                            : alert.type === 'desvio'
                              ? '↪️'
                              : '🚗'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className={`font-semibold text-sm line-clamp-1 ${textMain}`}>
                            {alert.title}
                          </h3>
                          <p className={`text-xs mt-0.5 ${textMuted}`}>
                            📍 {alert.location}
                          </p>
                          <span
                            className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium border
                              ${getAlertTypeStyles(alert.type)}`}
                          >
                            {getAlertTypeLabel(alert.type)}
                          </span>
                        </div>
                      </div>
                    </button>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Selected Item Detail */}
        {selectedItem && (
          <div
            id="detalle-mapa"
            className={`mt-6 p-6 rounded-2xl animate-fade-in ${panelBg}`}
          >
            {/* EVENT DETAIL */}
            {selectedItem.kind === 'evento' &&
              (() => {
                const event = mockEvents.find((e) => e.id === selectedItem.id)
                if (!event) return null
                return (
                  <div className="flex flex-col sm:flex-row gap-6">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full sm:w-48 h-48 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className={`text-xl font-bold ${textMain}`}>
                          {event.title}
                        </h2>
                        <button
                          onClick={() => setSelectedItem(null)}
                          className={`p-2 rounded-lg ${isDark ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}
                          aria-label="Cerrar detalle"
                        >
                          ✕
                        </button>
                      </div>

                      <p className={`mb-4 ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                        {event.description}
                      </p>

                      <div className={`grid sm:grid-cols-2 gap-3 text-sm ${textMuted}`}>
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>
                            {new Date(event.date).toLocaleDateString('es-EC', {
                              dateStyle: 'long',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🕐</span>
                          <span>
                            {event.time} - {event.endTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🏷️</span>
                          <span>{getCategoryLabel(event.category)}</span>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <button className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition">
                          Agregar a mi agenda
                        </button>
                        <button
                          className={`px-4 py-2 rounded-xl font-semibold border transition ${
                            isDark
                              ? 'border-surface-700 hover:bg-surface-800 text-white'
                              : 'border-surface-200 hover:bg-surface-50 text-surface-900'
                          }`}
                        >
                          Ver evento
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })()}

            {/* ROUTE DETAIL */}
            {selectedItem.kind === 'ruta' &&
              (() => {
                const route = mockRoutes.find((r) => r.id === selectedItem.id)
                if (!route) return null
                return (
                  <div className="flex flex-col sm:flex-row gap-6">
                    <img
                      src={route.image}
                      alt={route.title}
                      className="w-full sm:w-48 h-48 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className={`text-xl font-bold ${textMain}`}>
                          {route.title}
                        </h2>
                        <button
                          onClick={() => setSelectedItem(null)}
                          className={`p-2 rounded-lg ${isDark ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}
                          aria-label="Cerrar detalle"
                        >
                          ✕
                        </button>
                      </div>

                      <p className={`mb-4 ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                        {route.description}
                      </p>

                      <div className={`grid sm:grid-cols-2 gap-3 text-sm ${textMuted}`}>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{route.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🧭</span>
                          <span>{route.stops} paradas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>⏱️</span>
                          <span>Duración: {route.duration}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🏷️</span>
                          <span>Ruta temática</span>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <button className="px-4 py-2 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-semibold transition">
                          Guardar ruta
                        </button>
                        <button
                          className={`px-4 py-2 rounded-xl font-semibold border transition ${
                            isDark
                              ? 'border-surface-700 hover:bg-surface-800 text-white'
                              : 'border-surface-200 hover:bg-surface-50 text-surface-900'
                          }`}
                        >
                          Ver paradas
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })()}

            {/* ALERT DETAIL */}
            {selectedItem.kind === 'aviso' &&
              (() => {
                const alert = mockAlerts.find((a) => a.id === selectedItem.id)
                if (!alert) return null
                return (
                  <div className="flex flex-col sm:flex-row gap-6">
                    {alert.image && (
                      <img
                        src={alert.image}
                        alt={alert.title}
                        className="w-full sm:w-48 h-48 rounded-xl object-cover flex-shrink-0"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h2 className={`text-xl font-bold ${textMain}`}>
                          {alert.title}
                        </h2>
                        <button
                          onClick={() => setSelectedItem(null)}
                          className={`p-2 rounded-lg ${isDark ? 'hover:bg-surface-700' : 'hover:bg-surface-100'}`}
                          aria-label="Cerrar detalle"
                        >
                          ✕
                        </button>
                      </div>

                      <p className={`mb-4 ${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                        {alert.description}
                      </p>

                      <div className={`grid sm:grid-cols-2 gap-3 text-sm ${textMuted}`}>
                        <div className="flex items-center gap-2">
                          <span>📍</span>
                          <span>{alert.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>
                            Desde: {new Date(alert.startDate).toLocaleDateString('es-EC')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>
                            Hasta: {new Date(alert.endDate).toLocaleDateString('es-EC')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getAlertTypeStyles(
                              alert.type
                            )}`}
                          >
                            {getAlertTypeLabel(alert.type)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <button
                          className={`px-4 py-2 rounded-xl font-semibold border transition ${
                            isDark
                              ? 'border-surface-700 hover:bg-surface-800 text-white'
                              : 'border-surface-200 hover:bg-surface-50 text-surface-900'
                          }`}
                        >
                          Ver recomendaciones
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })()}
          </div>
        )}
      </div>
    </MenuPageLayout>
  )
}
