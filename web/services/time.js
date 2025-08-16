// src/services/shareService.js
import { calculateTimestampDifference } from '@/utils/date/calculateTimestampDifference'

export const time = {
    since: (timestampISO_1, timestampISO_2) => {
        /**
         * Formatea milisegundos, los cuales vienen dados de las diferencia de los dos timestamps
         * a un string legible en español
         */
        const diff_ms = calculateTimestampDifference(timestampISO_1, timestampISO_2)

        const diff_seconds = Math.floor(diff_ms / 1000)
        const diff_minutes = Math.floor(diff_seconds / 60)
        const diff_hours = Math.floor(diff_minutes / 60)
        const diff_days = Math.floor(diff_hours / 24)
        const dif_months = Math.floor(diff_days / 30)
        const diff_years = Math.floor(diff_days / 365)

        if (diff_years > 0) return `${diff_years} año${diff_years > 1 ? 's' : ''}`
        if (dif_months > 0) return `${dif_months} mes${dif_months > 1 ? 'es' : ''}`
        if (diff_days > 0) return `${diff_days} día${diff_days > 1 ? 's' : ''}`
        if (diff_hours > 0) return `${diff_hours} hora${diff_hours > 1 ? 's' : ''}`
        if (diff_minutes > 0) return `${diff_minutes} minuto${diff_minutes > 1 ? 's' : ''}`
        return `${diff_seconds} segundo${diff_seconds > 1 ? 's' : ''}`
    }
}
