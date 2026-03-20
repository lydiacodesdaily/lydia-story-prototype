'use client'

import { useEffect, useState } from 'react'
import { useWeatherStore } from '@/store/useWeatherStore'

function useClock() {
  const [time, setTime] = useState(() => ({
    time: formatTime(new Date()),
    date: formatDate(new Date()),
  }))
  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date()
      setTime({ time: formatTime(now), date: formatDate(now) })
    }, 10_000)
    return () => clearInterval(id)
  }, [])
  return time
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(d: Date) {
  return d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
}

export function WeatherHUD() {
  const {
    temperature,
    weatherEmoji,
    weatherDescription,
    city,
    moonPhaseEmoji,
    moonPhaseName,
    isLoading,
    error,
  } = useWeatherStore()
  const { time, date } = useClock()

  const hasWeather = temperature !== null
  const weatherUnavailable = !!error && !hasWeather

  return (
    <div className="fixed bottom-6 left-8 z-20 pointer-events-none select-none">
      <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl px-4 py-3 flex flex-col gap-2 min-w-[185px]">

        {/* Time + date row */}
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-white/90 text-lg font-light tracking-widest tabular-nums">
            {time}
          </span>
          <span className="text-white/30 text-[10px] tracking-wider uppercase">
            {date}
          </span>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Weather row */}
        {isLoading ? (
          <div className="flex items-center gap-2 text-white/25 text-xs tracking-wider animate-pulse">
            <span>— —</span>
          </div>
        ) : weatherUnavailable ? (
          <div className="text-white/20 text-[10px] tracking-wider">
            weather unavailable
          </div>
        ) : hasWeather ? (
          <div className="flex items-center gap-2 text-white/60 text-xs tracking-wider">
            <span className="text-sm leading-none">{weatherEmoji}</span>
            <span className="text-white/75">{weatherDescription}</span>
            <span className="text-white/30">·</span>
            <span>{temperature}°C</span>
          </div>
        ) : null}

        {/* Moon phase row */}
        <div className="flex items-center gap-2 text-white/45 text-[11px] tracking-wider">
          <span className="text-sm leading-none">{moonPhaseEmoji}</span>
          <span>{moonPhaseName}</span>
        </div>

        {/* City row */}
        {city && (
          <div className="text-white/25 text-[10px] tracking-wider truncate max-w-[200px]">
            {city}
          </div>
        )}
      </div>
    </div>
  )
}
