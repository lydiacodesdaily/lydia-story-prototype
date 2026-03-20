'use client'

import { useEffect, useRef } from 'react'
import {
  useWeatherStore,
  getTimeOfDay,
  getWeatherType,
  getWeatherEmoji,
  getWeatherDescription,
  getMoonPhase,
} from '@/store/useWeatherStore'

// Update time-of-day every minute
const TIME_INTERVAL_MS = 60_000

export function useWeather() {
  const setWeather = useWeatherStore((s) => s.setWeather)
  const hasFetched = useRef(false)

  // Keep time-of-day in sync with wall clock
  useEffect(() => {
    function tick() {
      const hour = new Date().getHours()
      const moon = getMoonPhase()
      setWeather({
        timeOfDay: getTimeOfDay(hour),
        moonPhaseName: moon.name,
        moonPhaseEmoji: moon.emoji,
      })
    }
    const id = setInterval(tick, TIME_INTERVAL_MS)
    return () => clearInterval(id)
  }, [setWeather])

  // Fetch weather once on mount
  useEffect(() => {
    if (hasFetched.current) return
    hasFetched.current = true

    if (!('geolocation' in navigator)) {
      setWeather({ error: 'Geolocation not supported', isLoading: false })
      return
    }

    setWeather({ isLoading: true })

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        const { latitude: lat, longitude: lon } = coords
        try {
          const [weatherRes, geoRes] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
              `&current=temperature_2m,weather_code,is_day&timezone=auto`
            ),
            fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            ),
          ])

          const weatherJson = await weatherRes.json()
          const geoJson = await geoRes.json()

          const current = weatherJson.current
          const code: number = current.weather_code
          const temp: number = Math.round(current.temperature_2m)
          const isDay: boolean = current.is_day === 1

          const addr = geoJson.address ?? {}
          const city =
            addr.city ?? addr.town ?? addr.village ?? addr.county ?? addr.state ?? null

          const hour = new Date().getHours()
          const moon = getMoonPhase()

          setWeather({
            temperature: temp,
            weatherCode: code,
            weatherType: getWeatherType(code),
            weatherEmoji: getWeatherEmoji(code, isDay),
            weatherDescription: getWeatherDescription(code),
            timeOfDay: getTimeOfDay(hour),
            isDay,
            city,
            moonPhaseName: moon.name,
            moonPhaseEmoji: moon.emoji,
            isLoading: false,
            error: null,
          })
        } catch {
          setWeather({ error: 'Could not load weather', isLoading: false })
        }
      },
      () => {
        setWeather({ error: 'Location access denied', isLoading: false })
      },
      { timeout: 8000 }
    )
  }, [setWeather])
}
