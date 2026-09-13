import React from 'react'
import { useFavorites } from '../../context/FavoritesContext'

const FavoritesBar = ({ currentName, onSelect }) => {
  const { favorites, toggleFavorite } = useFavorites()
  if (!favorites.length) return null

  return (
    <div className="favorites-bar d-flex flex-wrap gap-2 align-items-center mb-3" aria-label="Favorite locations">
      <span className="small text-muted"><i className="fa-solid fa-star me-1 text-warning" />Favorites</span>
      {favorites.map((f, i) => (
        <button
          key={i}
          type="button"
          className={`favorite-chip btn btn-sm${String(f.name).toLowerCase() === String(currentName).toLowerCase() ? ' active' : ''}`}
          onClick={() => onSelect(f)}
        >
          <i className="fa-solid fa-location-dot me-1 small text-warning" />
          {f.name}
          <i className="fa-solid fa-xmark ms-2 small" role="button" tabIndex={-1} onClick={e => { e.stopPropagation(); toggleFavorite(f) }} />
        </button>
      ))}
    </div>
  )
}

export default FavoritesBar