import React, { useEffect, useMemo, useState } from 'react'

const rand = (min, max) => Math.random() * (max - min) + min

function makeClouds(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: rand(0, 90),
    top: rand(5, 60),
    scale: rand(0.6, 1.4),
    duration: rand(30, 70),
    delay: rand(-40, 0),
    opacity: rand(0.1, 0.35),
  }))
}

function makeDrops(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: rand(0, 100),
    duration: rand(0.8, 1.6),
    delay: rand(-1.5, 0),
    height: rand(14, 30),
  }))
}

function makeFlakes(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    left: rand(0, 100),
    size: rand(4, 9),
    duration: rand(8, 18),
    delay: rand(-15, 0),
    sway: rand(20, 60),
  }))
}

function makeFog(n) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    top: rand(10, 85),
    scale: rand(1, 2.2),
    duration: rand(45, 90),
    delay: rand(-60, 0),
    opacity: rand(0.12, 0.3),
  }))
}

const BGS = {
  day: {
    clear: 'linear-gradient(180deg,#1e88e5 0%,#4fc3f7 45%,#b3e5fc 100%)',
    partly: 'linear-gradient(180deg,#5c9dcc 0%,#8ec6e8 55%,#cfdce6 100%)',
    cloudy: 'linear-gradient(180deg,#8595a5 0%,#aebcc9 60%,#cfd7df 100%)',
    fog: 'linear-gradient(180deg,#9aa7b1 0%,#bcc5cb 55%,#d3d9dd 100%)',
    rain: 'linear-gradient(180deg,#546e7a 0%,#78909c 55%,#90a4ae 100%)',
    snow: 'linear-gradient(180deg,#7f96ab 0%,#b8c6d2 60%,#dde4ea 100%)',
    sleet: 'linear-gradient(180deg,#5f788a 0%,#9ab2c2 60%,#c9d7df 100%)',
    thunder: 'linear-gradient(180deg,#39465a 0%,#54606e 55%,#737f8c 100%)',
  },
  night: {
    clear: 'linear-gradient(180deg,#101936 0%,#26365e 60%,#3f5280 100%)',
    partly: 'linear-gradient(180deg,#151d34 0%,#2a3a5c 60%,#445573 100%)',
    cloudy: 'linear-gradient(180deg,#1a2233 0%,#33404f 60%,#49565f 100%)',
    fog: 'linear-gradient(180deg,#232b33 0%,#414b52 55%,#5a646b 100%)',
    rain: 'linear-gradient(180deg,#141c26 0%,#303c48 60%,#46545e 100%)',
    snow: 'linear-gradient(180deg,#262e3a 0%,#45536a 60%,#63707f 100%)',
    sleet: 'linear-gradient(180deg,#1d2530 0%,#3c4a58 60%,#55636e 100%)',
    thunder: 'linear-gradient(180deg,#0f1420 0%,#242b38 55%,#3a4250 100%)',
  },
}

const AnimatedBackground = ({ category, isDay, code }) => {
  const [flash, setFlash] = useState(false)
  const palette = BGS[isDay ? 'day' : 'night'] || BGS.day
  const gradient = palette[category] || (isDay ? BGS.day.clear : BGS.night.clear)

  const clouds = useMemo(() => (category === 'partly' || category === 'cloudy' || category === 'sleet' ? makeClouds(category === 'cloudy' ? 6 : 4) : []), [category])
  const drops = useMemo(() => (category === 'rain' || category === 'sleet' ? makeDrops(category === 'rain' ? 60 : 30) : []), [category])
  const flakes = useMemo(() => (category === 'snow' ? makeFlakes(40) : []), [category])
  const fog = useMemo(() => (category === 'fog' ? makeFog(6) : []), [category])
  const isThunder = category === 'thunder'

  useEffect(() => {
    if (!isThunder) return undefined
    const timer = setInterval(() => {
      setFlash(true)
      setTimeout(() => setFlash(false), 220)
    }, rand(3500, 7500))
    return () => clearInterval(timer)
  }, [isThunder])

  const renderStars = isDay === false && (category === 'clear' || category === 'partly' || category === 'thunder')

  return (
    <div className="weather-bg" aria-hidden="true" data-code={code}>
      <div className="weather-bg-gradient" style={{ backgroundImage: gradient }} />
      {renderStars && <div className="bg-stars" />}
      {clouds.map(c => (
        <div key={c.id} className="bg-cloud" style={{ left: `${c.left}%`, top: `${c.top}%`, transform: `scale(${c.scale})`, animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s`, opacity: c.opacity }} />
      ))}
      {drops.map(d => (
        <div key={d.id} className="rain-drop" style={{ left: `${d.left}%`, height: `${d.height}px`, animationDuration: `${d.duration}s`, animationDelay: `${d.delay}s` }} />
      ))}
      {flakes.map(f => (
        <div key={f.id} className="snow-flake" style={{ left: `${f.left}%`, width: `${f.size}px`, height: `${f.size}px`, animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s`, '--sway': `${f.sway}px` }} />
      ))}
      {fog.map(f => (
        <div key={f.id} className="fog-band" style={{ top: `${f.top}%`, transform: `scale(${f.scale})`, animationDuration: `${f.duration}s`, animationDelay: `${f.delay}s`, opacity: f.opacity }} />
      ))}
      {isThunder && <div className={`thunder-flash${flash ? ' on' : ''}`} />}
    </div>
  )
}

export default AnimatedBackground