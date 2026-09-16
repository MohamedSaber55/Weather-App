import { useI18n } from '../../context/SettingsContext'
import React from 'react'
import { Icon } from '../Icons/Icons'

const ErrorRetry = ({ error, onRetry, compact, offline = false }) => {
  const { t } = useI18n()
  const message = offline ? t('offline.firstRun') : error?.message || t('error.body')

  if (compact) {
    return (
      <div className="notice is-error" role="alert">
        <Icon name="alert" size={14} />
        <span className="notice-text">{message}</span>
        <button type="button" className="ghost-btn" onClick={onRetry}>
          <Icon name="rotate" size={12} />
          {t('error.retry')}
        </button>
      </div>
    )
  }

  return (
    <div className="error-pane" role="alert">
      <div className="tile error-tile">
        <header className="tile-head">
          <h2 className="tile-label">{offline ? t('offline.title') : t('error.title')}</h2>
          <span className="tile-meta">{t('meta.noData')}</span>
        </header>
        <p className="error-message">{message}</p>
        <button type="button" className="btn" onClick={onRetry}>
          <Icon name="rotate" size={13} />
          {t('error.retry')}
        </button>
      </div>
    </div>
  )
}

export default ErrorRetry
