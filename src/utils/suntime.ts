import * as sunjs from 'sunrise-sunset-js'
import { formatTime } from '@/utils/common'

export function getSunrise(
  latitude: number,
  longitude: number,
  date?: Date
): string {
  return formatTime(sunjs.getSunrise(latitude, longitude, date))
}

export function getSunset(
  latitude: number,
  longitude: number,
  date?: Date
): string {
  return formatTime(sunjs.getSunset(latitude, longitude, date))
}

export function getSuntime(latitude: number, longitude: number) {
  return {
    sunrise: getSunrise(latitude, longitude),
    sunset: getSunset(latitude, longitude)
  }
}
