import { create } from 'zustand'

export type WeatherType = 'clear' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm'
export type TimeOfDay = 'dawn' | 'morning' | 'midday' | 'afternoon' | 'dusk' | 'night'

// Sky + fog color pairs by time of day (clear conditions)
const CLEAR_SKY: Record<TimeOfDay, { sky: string; fog: string }> = {
  dawn:      { sky: '#f5c4a8', fog: '#e8b090' },
  morning:   { sky: '#7ec8e3', fog: '#a8d8f0' },
  midday:    { sky: '#4ab8e8', fog: '#88cce8' },
  afternoon: { sky: '#72b8d8', fog: '#98c8e0' },
  dusk:      { sky: '#e86840', fog: '#d06050' },
  night:     { sky: '#142438', fog: '#0e1e30' },
}

// Overrides for non-clear weather (same regardless of time)
const WEATHER_SKY: Partial<Record<WeatherType, { sky: string; fog: string }>> = {
  cloudy: { sky: '#8898a8', fog: '#7a8a98' },
  fog:    { sky: '#9aacb4', fog: '#8a9ca4' },
  rain:   { sky: '#4a6070', fog: '#3a5060' },
  snow:   { sky: '#c8d8e8', fog: '#d8e8f5' },
  storm:  { sky: '#2a3a44', fog: '#1e2e38' },
}

function getSkyColors(timeOfDay: TimeOfDay, weatherType: WeatherType) {
  return WEATHER_SKY[weatherType] ?? CLEAR_SKY[timeOfDay]
}

export function getTimeOfDay(hour: number): TimeOfDay {
  if (hour >= 5 && hour < 7)  return 'dawn'
  if (hour >= 7 && hour < 11) return 'morning'
  if (hour >= 11 && hour < 14) return 'midday'
  if (hour >= 14 && hour < 18) return 'afternoon'
  if (hour >= 18 && hour < 20) return 'dusk'
  return 'night'
}

export function getWeatherType(code: number): WeatherType {
  if (code === 0 || code === 1)                         return 'clear'
  if (code === 2 || code === 3)                         return 'cloudy'
  if (code === 45 || code === 48)                       return 'fog'
  if ([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code)) return 'rain'
  if ([71,73,75,77,85,86].includes(code))               return 'snow'
  if ([95,96,99].includes(code))                        return 'storm'
  return 'clear'
}

export function getWeatherEmoji(code: number, isDay: boolean): string {
  if (code === 0) return isDay ? '☀️' : '🌙'
  if (code === 1 || code === 2) return isDay ? '⛅' : '🌃'
  if (code === 3) return '☁️'
  if (code === 45 || code === 48) return '🌫️'
  if ([51,53,55].includes(code)) return '🌦️'
  if ([56,57,61,63,65,66,67,80,81,82].includes(code)) return '🌧️'
  if ([71,73,75,77,85,86].includes(code)) return '❄️'
  if ([95,96,99].includes(code)) return '⛈️'
  return '🌤️'
}

const KNOWN_NEW_MOON_MS = 947182440000 // Jan 6 2000 18:14 UTC
const LUNAR_CYCLE_MS = 29.53058867 * 24 * 60 * 60 * 1000

export function getMoonPhase(now: Date = new Date()): { phaseDays: number; name: string; emoji: string } {
  const elapsed = now.getTime() - KNOWN_NEW_MOON_MS
  const phaseDays = ((elapsed % LUNAR_CYCLE_MS) + LUNAR_CYCLE_MS) % LUNAR_CYCLE_MS / (1000 * 60 * 60 * 24)

  let name: string
  let emoji: string
  if (phaseDays < 1.85)        { name = 'New Moon';         emoji = '🌑' }
  else if (phaseDays < 7.38)   { name = 'Waxing Crescent';  emoji = '🌒' }
  else if (phaseDays < 9.22)   { name = 'First Quarter';    emoji = '🌓' }
  else if (phaseDays < 14.77)  { name = 'Waxing Gibbous';   emoji = '🌔' }
  else if (phaseDays < 16.61)  { name = 'Full Moon';        emoji = '🌕' }
  else if (phaseDays < 22.15)  { name = 'Waning Gibbous';   emoji = '🌖' }
  else if (phaseDays < 24.00)  { name = 'Last Quarter';     emoji = '🌗' }
  else if (phaseDays < 27.68)  { name = 'Waning Crescent';  emoji = '🌘' }
  else                         { name = 'New Moon';         emoji = '🌑' }

  return { phaseDays, name, emoji }
}

export function getWeatherDescription(code: number): string {
  if (code === 0) return 'Clear'
  if (code === 1) return 'Mainly clear'
  if (code === 2) return 'Partly cloudy'
  if (code === 3) return 'Overcast'
  if (code === 45 || code === 48) return 'Foggy'
  if (code === 51 || code === 53) return 'Light drizzle'
  if (code === 55) return 'Drizzle'
  if (code === 56 || code === 57) return 'Freezing drizzle'
  if (code === 61) return 'Light rain'
  if (code === 63) return 'Moderate rain'
  if (code === 65 || code === 66 || code === 67) return 'Heavy rain'
  if (code === 71) return 'Light snow'
  if (code === 73) return 'Moderate snow'
  if (code === 75 || code === 77) return 'Heavy snow'
  if (code === 80) return 'Rain showers'
  if (code === 81 || code === 82) return 'Heavy showers'
  if (code === 85 || code === 86) return 'Snow showers'
  if (code === 95) return 'Thunderstorm'
  if (code === 96 || code === 99) return 'Severe thunderstorm'
  return 'Unknown'
}

interface WeatherState {
  temperature: number | null
  weatherCode: number | null
  weatherType: WeatherType
  weatherEmoji: string
  weatherDescription: string
  timeOfDay: TimeOfDay
  skyColor: string
  fogColor: string
  isDay: boolean
  city: string | null
  moonPhaseName: string
  moonPhaseEmoji: string
  isLoading: boolean
  error: string | null
}

interface WeatherActions {
  setWeather: (data: Partial<WeatherState>) => void
  recalcColors: () => void
}

export const useWeatherStore = create<WeatherState & WeatherActions>((set, get) => {
  const _tod = getTimeOfDay(new Date().getHours())
  const _moon = getMoonPhase()
  return {
  temperature: null,
  weatherCode: null,
  weatherType: 'clear',
  weatherEmoji: '☀️',
  weatherDescription: 'Clear',
  timeOfDay: _tod,
  skyColor: CLEAR_SKY[_tod].sky,
  fogColor: CLEAR_SKY[_tod].fog,
  isDay: true,
  city: null,
  moonPhaseName: _moon.name,
  moonPhaseEmoji: _moon.emoji,
  isLoading: false,
  error: null,

  setWeather: (data) => set((prev) => {
    const next = { ...prev, ...data }
    const colors = getSkyColors(next.timeOfDay, next.weatherType)
    return { ...next, skyColor: colors.sky, fogColor: colors.fog }
  }),

  recalcColors: () => {
    const { timeOfDay, weatherType } = get()
    const colors = getSkyColors(timeOfDay, weatherType)
    set({ skyColor: colors.sky, fogColor: colors.fog })
  },
  }
})