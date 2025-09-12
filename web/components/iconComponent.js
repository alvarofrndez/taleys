'use client'

import { useState, useEffect, useMemo } from 'react'
import styles from '@/assets/global/icon.module.scss'

export default function Icon({
  name,
  width = 16,
  height = 16,
  color,
  className = '',
  hoverColor,
  fill, // 👈 ahora opcional, solo se aplica si lo pasas
  onClick = null
}) {
  const [svgContent, setSvgContent] = useState(null)

  useEffect(() => {
    fetch(`/images/icons/${name}.svg`)
      .then(res => res.text())
      .then(text => setSvgContent(text))
      .catch(err => console.error(`No se pudo cargar el icono ${name}:`, err))
  }, [name])

  const coloredSvg = useMemo(() => {
    if (!svgContent) return null

    let result = svgContent
      // strokes → siempre currentColor
      .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')

    if (fill) {
      // 👇 Solo reemplazamos fill si ya existe en el svg
      if (/fill="[^"]*"/.test(result)) {
        result = result.replace(/fill="[^"]*"/g, `fill="${fill}"`)
      }
    }

    return result
  }, [svgContent, fill])

  if (!coloredSvg) return null

  return (
    <span
      className={`${styles.iconWrapper} ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height,
        color: color,
        stroke: color
      }}
      dangerouslySetInnerHTML={{ __html: coloredSvg }}
      onMouseEnter={
        hoverColor ? (e) => (e.currentTarget.style.color = hoverColor) : undefined
      }
      onMouseLeave={
        hoverColor ? (e) => (e.currentTarget.style.color = color || 'currentColor') : undefined
      }
      onClick={onClick || undefined}
    />
  )
}
