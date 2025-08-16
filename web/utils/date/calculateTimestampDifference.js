export const calculateTimestampDifference = (timestampISO_1, timestampISO_2) => {
    /**
     * Calcula la diferencia de tiempo entre dos timestamps, devolviendo los milisegundos de diferencias
     */
    const start = timestampISO_1 instanceof Date ? timestampISO_1 : new Date(timestampISO_1)
    const end = timestampISO_2 instanceof Date ? timestampISO_2 : new Date(timestampISO_2)
    return end.getTime() - start.getTime()
}