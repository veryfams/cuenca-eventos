import { useMemo, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import MenuPageLayout from '../components/menu/MenuPageLayout'
import { mockEvents, Event, getCategoryLabel, getCategoryColor } from '../mocks/eventData'

type ResponseType = 'attending' | 'interested' | 'notGoing'

export default function EventosPage() {
  const { isDark } = useTheme()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [userResponses, setUserResponses] = useState<Record<number, ResponseType>>({})
  const [sortBy, setSortBy] = useState<'dateAsc' | 'dateDesc'>('dateAsc')

  // OJO: no borro nada de tu data, solo organizo UX.
  const categories = ['all', 'cultural', 'religioso', 'gastronomico', 'artistico', 'tradicional']

  const filteredEvents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    const base = mockEvents.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q) ||
        (event.location?.toLowerCase?.().includes(q) ?? false) ||
        (event.address?.toLowerCase?.().includes(q) ?? false)

      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory

      return matchesSearch && matchesCategory
    })

    const sorted = [...base].sort((a, b) => {
      // dateAsc = próximos primero. dateDesc = más recientes primero.
      const da = new Date(a.date).getTime()
      const db = new Date(b.date).getTime()
      return sortBy === 'dateAsc' ? da - db : db - da
    })

    return sorted
  }, [searchQuery, selectedCategory, sortBy])

  const handleResponse = (eventId: number, response: ResponseType) => {
    setUserResponses((prev) => {
      // toggle: si ya estaba, lo quitamos
      if (prev[eventId] === response) {
        const copy = { ...prev }
        delete copy[eventId]
        return copy
      }
      return { ...prev, [eventId]: response }
    })
  }

  const getResponseButtonStyle = (eventId: number, type: ResponseType) => {
    const isSelected = userResponses[eventId] === type

    if (type === 'attending') {
      return isSelected
        ? 'bg-green-500 text-white border-green-500'
        : isDark
          ? 'bg-surface-700 text-surface-300 border-surface-600 hover:bg-green-500/20 hover:border-green-500'
          : 'bg-surface-100 text-surface-600 border-surface-200 hover:bg-green-50 hover:border-green-500'
    }

    if (type === 'interested') {
      return isSelected
        ? 'bg-accent-500 text-white border-accent-500'
        : isDark
          ? 'bg-surface-700 text-surface-300 border-surface-600 hover:bg-accent-500/20 hover:border-accent-500'
          : 'bg-surface-100 text-surface-600 border-surface-200 hover:bg-accent-50 hover:border-accent-500'
    }

    return isSelected
      ? 'bg-secondary-500 text-white border-secondary-500'
      : isDark
        ? 'bg-surface-700 text-surface-300 border-surface-600 hover:bg-secondary-500/20 hover:border-secondary-500'
        : 'bg-surface-100 text-surface-600 border-surface-200 hover:bg-secondary-50 hover:border-secondary-500'
  }

  const activeCount = filteredEvents.length
  const totalCount = mockEvents.length

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSortBy('dateAsc')
  }

  return (
    <MenuPageLayout title="Eventos">
      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-white mb-2">🎉 Eventos</h1>
          <p className="text-surface-300">Descubre todos los eventos de Cuenca</p>
        </div>

        {/* Search + Filters */}
        <div
          className={`
            p-4 rounded-2xl mb-6
            ${isDark
              ? 'bg-surface-800/90 backdrop-blur-sm border border-surface-700'
              : 'bg-white/90 backdrop-blur-sm border border-surface-200 shadow-lg'}
          `}
        >
          <div className="grid gap-3 lg:grid-cols-12">
            {/* Search */}
            <div className="lg:col-span-5">
              <div
                className={`
                  relative flex items-center rounded-xl overflow-hidden border
                  ${isDark ? 'bg-surface-700 border-surface-600' : 'bg-surface-50 border-surface-200'}
                `}
              >
                <span className="pl-4 text-lg" aria-hidden="true">
                  🔍
                </span>
                <input
                  type="text"
                  placeholder="Buscar por nombre, descripción, ubicación o dirección..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`
                    w-full px-3 py-3 text-sm bg-transparent outline-none
                    ${isDark ? 'text-white placeholder-surface-400' : 'text-surface-900 placeholder-surface-500'}
                  `}
                  aria-label="Buscar eventos"
                />
                {searchQuery.trim().length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className={`
                      mr-2 px-3 py-2 rounded-lg text-xs font-semibold
                      ${isDark ? 'bg-surface-600 text-surface-100 hover:bg-surface-500' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}
                    `}
                    aria-label="Limpiar búsqueda"
                    title="Limpiar búsqueda"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Category */}
            <div className="lg:col-span-4">
              <div
                className={`
                  grid grid-cols-2 sm:grid-cols-3 gap-2
                `}
              >
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`
                      px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300
                      ${selectedCategory === cat
                        ? 'bg-primary-500 text-white'
                        : isDark
                          ? 'bg-surface-700 text-surface-300 hover:bg-surface-600'
                          : 'bg-surface-100 text-surface-600 hover:bg-surface-200'}
                    `}
                    aria-pressed={selectedCategory === cat}
                  >
                    {cat === 'all' ? 'Todos' : getCategoryLabel(cat)}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort + Clear */}
            <div className="lg:col-span-3 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-end">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'dateAsc' | 'dateDesc')}
                className={`
                  w-full sm:w-auto px-4 py-2.5 rounded-xl border text-sm font-medium
                  focus:outline-none focus:ring-2 focus:ring-primary-500
                  ${isDark ? 'bg-surface-700 border-surface-600 text-white' : 'bg-surface-50 border-surface-200 text-surface-900'}
                `}
                aria-label="Ordenar eventos"
              >
                <option value="dateAsc">Fecha: próximos primero</option>
                <option value="dateDesc">Fecha: recientes primero</option>
              </select>

              <button
                type="button"
                onClick={clearFilters}
                className={`
                  w-full sm:w-auto px-4 py-2.5 rounded-xl text-sm font-semibold transition-all
                  ${isDark ? 'bg-surface-700 text-surface-200 hover:bg-surface-600' : 'bg-surface-100 text-surface-700 hover:bg-surface-200'}
                `}
              >
                Limpiar filtros
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <p className={`text-sm ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>
              Mostrando {activeCount} de {totalCount} eventos
            </p>

            <div className={`text-xs ${isDark ? 'text-surface-500' : 'text-surface-500'}`}>
              Tip: toca una tarjeta para ver el detalle completo.
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <article
              key={event.id}
              role="button"
              tabIndex={0}
              aria-label={`Ver detalle de ${event.title}`}
              className={`
                group rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] cursor-pointer
                focus:outline-none focus:ring-2 focus:ring-primary-500
                ${isDark
                  ? 'bg-surface-800/90 backdrop-blur-sm border border-surface-700 hover:border-primary-500/50'
                  : 'bg-white/90 backdrop-blur-sm border border-surface-200 shadow-lg hover:shadow-xl'}
              `}
              onClick={() => setSelectedEvent(event)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setSelectedEvent(event)
              }}
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                <span
                  className={`
                    absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white
                    bg-gradient-to-r ${getCategoryColor(event.category)}
                  `}
                >
                  {getCategoryLabel(event.category)}
                </span>

                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between gap-2">
                  <p className="text-xs opacity-90">
                    📅{' '}
                    {new Date(event.date).toLocaleDateString('es-EC', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="text-xs opacity-90">🕐 {event.time}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3
                  className={`
                    font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary-500 transition-colors
                    ${isDark ? 'text-white' : 'text-surface-900'}
                  `}
                >
                  {event.title}
                </h3>

                <p className={`text-sm line-clamp-2 mb-3 ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>
                  {event.description}
                </p>

                <div className={`flex flex-col gap-1 text-xs ${isDark ? 'text-surface-500' : 'text-surface-500'}`}>
                  <span className="line-clamp-1">📍 {event.location}</span>
                  {event.address && <span className="line-clamp-1">🧭 {event.address}</span>}
                </div>

                {/* Quick Response Buttons */}
                <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => handleResponse(event.id, 'attending')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${getResponseButtonStyle(event.id, 'attending')}`}
                    aria-label={`Marcar como asistiré: ${event.title}`}
                  >
                    ✅ Asistiré
                  </button>
                  <button
                    type="button"
                    onClick={() => handleResponse(event.id, 'interested')}
                    className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium border transition-all ${getResponseButtonStyle(event.id, 'interested')}`}
                    aria-label={`Marcar como me interesa: ${event.title}`}
                  >
                    ⭐ Interesa
                  </button>
                </div>

                {/* Estado rápido */}
                {userResponses[event.id] && (
                  <div
                    className={`
                      mt-3 text-xs font-semibold px-3 py-2 rounded-xl border
                      ${isDark ? 'bg-surface-700/50 border-surface-600 text-surface-200' : 'bg-surface-50 border-surface-200 text-surface-700'}
                    `}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {userResponses[event.id] === 'attending' && '✅ Marcado: Asistiré'}
                    {userResponses[event.id] === 'interested' && '⭐ Marcado: Me interesa'}
                    {userResponses[event.id] === 'notGoing' && '❌ Marcado: No voy'}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className={`text-center py-16 ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>
            <span className="text-6xl block mb-4" aria-hidden="true">
              🔍
            </span>
            <p className="text-xl font-semibold mb-2">No se encontraron eventos</p>
            <p className="text-sm mb-4">Intenta con otra búsqueda o categoría</p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-6 py-3 rounded-xl font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-all duration-300"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedEvent(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle del evento ${selectedEvent.title}`}
        >
          <div
            className={`
              w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl
              ${isDark ? 'bg-surface-800' : 'bg-white'}
            `}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative h-64 overflow-hidden">
              <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                aria-label="Cerrar detalle"
              >
                ✕
              </button>
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 bg-gradient-to-r ${getCategoryColor(selectedEvent.category)}`}
                >
                  {getCategoryLabel(selectedEvent.category)}
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold">{selectedEvent.title}</h2>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Info Grid */}
              <div
                className={`grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 rounded-xl ${
                  isDark ? 'bg-surface-700/50' : 'bg-surface-50'
                }`}
              >
                <div>
                  <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Fecha</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>
                    {new Date(selectedEvent.date).toLocaleDateString('es-EC', { dateStyle: 'long' })}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Horario</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>
                    {selectedEvent.time} - {selectedEvent.endTime}
                  </p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Ubicación</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{selectedEvent.location}</p>
                </div>
                <div>
                  <p className={`text-xs ${isDark ? 'text-surface-400' : 'text-surface-500'}`}>Dirección</p>
                  <p className={`font-semibold ${isDark ? 'text-white' : 'text-surface-900'}`}>{selectedEvent.address}</p>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-surface-900'}`}>Descripción</h3>
                <p className={`${isDark ? 'text-surface-300' : 'text-surface-600'}`}>
                  {selectedEvent.longDescription || selectedEvent.description}
                </p>
              </div>

              {/* Itinerary */}
              {selectedEvent.itinerary && selectedEvent.itinerary.length > 0 && (
                <div className="mb-6">
                  <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-surface-900'}`}>📋 Itinerario</h3>
                  <div className="space-y-2">
                    {selectedEvent.itinerary.map((item, index) => (
                      <div
                        key={index}
                        className={`flex gap-4 p-3 rounded-lg ${isDark ? 'bg-surface-700/50' : 'bg-surface-50'}`}
                      >
                        <span className="text-primary-500 font-bold">{item.time}</span>
                        <span className={isDark ? 'text-surface-300' : 'text-surface-600'}>{item.activity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Closed Streets */}
              {selectedEvent.closedStreets && selectedEvent.closedStreets.length > 0 && (
                <div className="mb-6">
                  <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-surface-900'}`}>🚧 Vías Cerradas</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.closedStreets.map((street, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 rounded-full text-sm ${
                          isDark ? 'bg-secondary-500/20 text-secondary-400' : 'bg-secondary-100 text-secondary-600'
                        }`}
                      >
                        {street}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials */}
              {selectedEvent.testimonials && selectedEvent.testimonials.length > 0 && (
                <div className="mb-6">
                  <h3 className={`font-bold mb-3 ${isDark ? 'text-white' : 'text-surface-900'}`}>💬 Testimonios</h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedEvent.testimonials.map((testimonial, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-xl ${isDark ? 'bg-surface-700/50' : 'bg-surface-50'}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white text-sm font-bold">
                            {testimonial.name.charAt(0)}
                          </div>
                          <span className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-surface-900'}`}>
                            {testimonial.name}
                          </span>
                          <span className="text-yellow-500">{'⭐'.repeat(testimonial.rating)}</span>
                        </div>
                        <p className={`text-sm italic ${isDark ? 'text-surface-400' : 'text-surface-600'}`}>
                          "{testimonial.comment}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className={`flex flex-wrap gap-3 pt-4 border-t ${isDark ? 'border-surface-700/50' : 'border-surface-200'}`}>
                <button
                  onClick={() => handleResponse(selectedEvent.id, 'attending')}
                  className={`flex-1 sm:flex-none py-3 px-6 rounded-xl font-semibold border transition-all ${getResponseButtonStyle(
                    selectedEvent.id,
                    'attending'
                  )}`}
                  aria-label="Marcar como asistiré"
                >
                  ✅ Asistiré
                </button>
                <button
                  onClick={() => handleResponse(selectedEvent.id, 'interested')}
                  className={`flex-1 sm:flex-none py-3 px-6 rounded-xl font-semibold border transition-all ${getResponseButtonStyle(
                    selectedEvent.id,
                    'interested'
                  )}`}
                  aria-label="Marcar como me interesa"
                >
                  ⭐ Me interesa
                </button>
                <button
                  onClick={() => handleResponse(selectedEvent.id, 'notGoing')}
                  className={`flex-1 sm:flex-none py-3 px-6 rounded-xl font-semibold border transition-all ${getResponseButtonStyle(
                    selectedEvent.id,
                    'notGoing'
                  )}`}
                  aria-label="Marcar como no voy"
                >
                  ❌ No voy
                </button>

                {/* Nota UX: esto simula “Agregar a mi agenda” sin backend */}
                <button
                  onClick={() => {
                    // no borro nada: solo feedback simple para evaluación de usabilidad
                    alert('✅ Evento guardado en “Mi Agenda” (simulado).')
                  }}
                  className="flex-1 sm:flex-none py-3 px-6 rounded-xl font-semibold bg-primary-500 hover:bg-primary-600 text-white transition-all"
                  aria-label="Guardar en mi agenda"
                >
                  🗓️ Guardar en mi agenda
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </MenuPageLayout>
  )
}
