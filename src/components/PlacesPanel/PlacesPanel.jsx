import React from 'react'
import { Icon } from '../Icons/Icons'
import { useI18n } from '../../context/SettingsContext'
import { placeKey, useFavorites } from '../../context/FavoritesContext'

const PlacesPanel = ({ open, onClose, onSelectPlace, onAddBySearch, onAddByMap, currentName }) => {
  const { t } = useI18n()
  const { favorites, defaultPlace, setDefaultPlace, removeFavorite } = useFavorites()

  if (!open) return null

  const isDefault = place => defaultPlace && placeKey(defaultPlace) === placeKey(place)
  const isCurrent = place => String(place.name).toLowerCase() === String(currentName || '').toLowerCase()

  return (
    <div className="modal-backdrop-wx" onClick={onClose} role="presentation">
      <div className="places-dialog" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={t('places.title')}>
        <header className="places-head">
          <h2 className="tile-label">{t('places.title')}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label={t('settings.close')}>
            <Icon name="close" size={16} />
          </button>
        </header>

        <div className="places-body">
          {favorites.length === 0 ? (
            <p className="places-empty">{t('places.empty')}</p>
          ) : (
            <ul className="places-list">
              {favorites.map(place => (
                <li key={placeKey(place)} className={`places-row${isCurrent(place) ? ' is-current' : ''}`}>
                  <button
                    type="button"
                    className="places-main"
                    onClick={() => {
                      onSelectPlace(place)
                      onClose()
                    }}
                  >
                    <Icon name="pin" size={15} />
                    <span className="places-text">
                      <span className="places-name">{place.name}</span>
                      <span className="places-region">
                        {[place.region, place.country].filter(Boolean).join(', ') || '—'}
                      </span>
                    </span>
                  </button>

                  {isDefault(place) ? (
                    <span className="places-tag">{t('places.default')}</span>
                  ) : (
                    <button
                      type="button"
                      className="icon-btn is-ghost"
                      onClick={() => setDefaultPlace(place)}
                      title={t('places.setDefault')}
                      aria-label={`${t('places.setDefault')}: ${place.name}`}
                    >
                      <Icon name="home" size={15} />
                    </button>
                  )}

                  <button
                    type="button"
                    className="icon-btn is-ghost"
                    onClick={() => removeFavorite(place)}
                    title={t('places.remove')}
                    aria-label={`${t('places.remove')}: ${place.name}`}
                  >
                    <Icon name="trash" size={15} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div className="places-actions">
            <button type="button" className="btn" onClick={onAddBySearch}>
              <Icon name="search" size={13} />
              {t('places.search')}
            </button>
            <button type="button" className="btn" onClick={onAddByMap}>
              <Icon name="pin" size={13} />
              {t('places.map')}
            </button>
          </div>

          <p className="places-note">{t('places.note')}</p>
        </div>
      </div>
    </div>
  )
}

export default PlacesPanel
