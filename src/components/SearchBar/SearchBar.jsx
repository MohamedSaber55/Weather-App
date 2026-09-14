import React, { useEffect, useId, useRef, useState } from 'react'
import { getSearchResults } from '../../lib/api'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { useFavorites } from '../../context/FavoritesContext'
import { Icon } from '../Icons/Icons'

const SearchBar = ({ onSelect, inputRef, open: forcedOpen, onClose }) => {
  const [text, setText] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(-1)
  const debounced = useDebouncedValue(text, 300)
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
        if (cancelled) return
        setSuggestions(Array.isArray(data) ? data : [])
        setLoading(false)
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
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        onClose?.()
      }
    }
    document.addEventListener('mousedown', onDocClick)
    return () => document.removeEventListener('mousedown', onDocClick)
  }, [onClose])

  const showRecents = open && debounced.trim().length < 2
  const list = showRecents ? recents.slice(0, 5) : suggestions

  const selectPlace = place => {
    onSelect(place)
    setText('')
    setSuggestions([])
    setActive(-1)
    setOpen(false)
    inputRef?.current?.blur()
    onClose?.()
  }

  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      setOpen(false)
      inputRef?.current?.blur()
      onClose?.()
      return
    }
    if (e.key === 'ArrowDown' && list.length) {
      e.preventDefault()
      setActive(i => (i + 1) % list.length)
    } else if (e.key === 'ArrowUp' && list.length) {
      e.preventDefault()
      setActive(i => (i - 1 + list.length) % list.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (active >= 0 && list[active]) selectPlace(list[active])
      else if (list[0]) selectPlace(list[0])
      else if (text.trim()) selectPlace({ name: text.trim() })
    }
  }

  return (
    <div className={`search${forcedOpen ? ' is-open' : ''}`} ref={containerRef}>
      <span className="search-field">
        <Icon name="search" size={14} className="search-icon" />
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          value={text}
          onChange={e => {
            setText(e.target.value)
            setOpen(true)
            setActive(-1)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search city"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-label="Search for a city"
          aria-autocomplete="list"
          autoComplete="off"
        />
        {loading ? <Icon name="rotate" size={12} className="search-spinner" /> : <kbd className="search-kbd hide-mobile">/</kbd>}
        <button type="button" className="search-close only-mobile" onClick={() => { setOpen(false); onClose?.() }} aria-label="Close search">
          <Icon name="close" size={14} />
        </button>
      </span>
      {open && (
        <div className="search-menu" id={listboxId} role="listbox" aria-label="Search results">
          {list.length > 0 && (
            <>
              <p className="search-group">{showRecents ? 'Recent' : 'Results'}</p>
              {list.map((place, i) => (
                <button
                  key={`${place.lat}-${place.lon}-${place.name}-${i}`}
                  type="button"
                  role="option"
                  aria-selected={i === active}
                  className={`search-item${i === active ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={e => {
                    e.preventDefault()
                    selectPlace(place)
                  }}
                >
                  <Icon name={showRecents ? 'history' : 'pin'} size={13} className="search-item-icon" />
                  <span className="search-item-name">{place.name}</span>
                  <span className="search-item-region">
                    {[place.region, place.country].filter(Boolean).join(', ')}
                  </span>
                </button>
              ))}
            </>
          )}
          {!showRecents && !loading && list.length === 0 && debounced.trim().length >= 2 && (
            <p className="search-empty">No places match “{debounced.trim()}”</p>
          )}
          {showRecents && list.length === 0 && <p className="search-empty">Type at least 2 characters</p>}
        </div>
      )}
    </div>
  )
}

export default SearchBar
