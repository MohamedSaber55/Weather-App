import React, { useEffect, useId, useRef, useState } from 'react'
import { getSearchResults } from '../../lib/api'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useFavorites } from '../../context/FavoritesContext'

const SearchBar = ({ value, onChange, onSelect, placeholder = 'Search city…', autoFocus }) => {
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(-1)
  const debounced = useDebouncedValue(value, 350)
  const containerRef = useRef(null)
  const listboxId = useId()
  const { recents } = useFavorites()

  useEffect(() => {
    const q = debounced.trim()
    if (q.length < 2) {
      setSuggestions([])
      setLoading(false)
      return undefined
    }
    let cancelled = false
    setLoading(true)
    getSearchResults(q, 6)
      .then(data => {
        if (!cancelled) {
          setSuggestions(Array.isArray(data) ? data : [])
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [debounced])

  useEffect(() => {
    const onDocClick = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [])

  const showRecents = open && debounced.trim().length < 2

  const selectPlace = place => {
    onSelect(place)
    setOpen(false)
    setActive(-1)
    setSuggestions([])
  }

  const handleKeyDown = e => {
    if (!open) return
    const list = suggestions.length ? suggestions : recents
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive(i => (i + 1) % list.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive(i => (i - 1 + list.length) % list.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && list[active]) selectPlace(list[active])
      else if (list[0]) selectPlace(list[0])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const renderRow = (place, i) => (
    <button
      key={`${place.lat}-${place.lon}-${place.name}-${i}`}
      type="button"
      className={`autocomplete-item${i === active ? ' active' : ''}`}
      onMouseEnter={() => setActive(i)}
      onMouseDown={e => {
        e.preventDefault()
        selectPlace(place)
      }}
    >
      <i className="fa-solid fa-location-dot text-muted me-2" />
      <span className="flex-grow-1 text-start">
        <strong>{place.name}</strong>
        {place.region && <span className="text-muted small"> · {place.region}</span>}
        {place.country && <span className="text-muted small">, {place.country}</span>}
      </span>
      <i className="fa-solid fa-magnifying-glass-plus text-muted small" />
    </button>
  )

  return (
    <div className="search-wrap position-relative flex-grow-1" ref={containerRef}>
      <i className="fa-solid fa-magnifying-glass search-icon" />
      <input
        autoFocus={autoFocus}
        type="text"
        className="form-control ps-4 pe-5"
        value={value}
        onChange={e => {
          onChange(e.target.value)
          setOpen(true)
          setActive(-1)
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        role="combobox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-label="Search for a city"
        aria-autocomplete="list"
        autoComplete="off"
      />
      {loading && <i className="fa-solid fa-circle-notch fa-spin search-spinner" />}
      {open && (
        <div className="autocomplete dropdown-menu show" id={listboxId} role="listbox">
          {showRecents && recents.length > 0 && (
            <>
              <div className="autocomplete-label"><i className="fa-solid fa-clock-rotate-left me-1" /> Recent</div>
              {recents.slice(0, 4).map(renderRow)}
            </>
          )}
          {!showRecents && suggestions.length > 0 && (
            <>
              <div className="autocomplete-label"><i className="fa-solid fa-bolt me-1" /> Results</div>
              {suggestions.map(renderRow)}
            </>
          )}
          {!showRecents && suggestions.length === 0 && !loading && debounced.trim().length >= 2 && (
            <div className="autocomplete-empty">No places found for “{debounced.trim()}”</div>
          )}
          {suggestions.length === 0 && recents.length === 0 && !loading && !showRecents && (
            <div className="autocomplete-empty">Type at least 2 characters to search</div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchBar