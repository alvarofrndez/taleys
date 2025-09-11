'use client'

import { useState, useEffect, useMemo } from 'react'
import styles from '@/assets/global/icon.module.scss'

export default function Icon({ name, width = 16, height = 16, color, className = '', hoverColor }) {
  const [svgContent, setSvgContent] = useState(null)

  useEffect(() => {
    fetch(`/images/icons/${name}.svg`)
      .then(res => res.text())
      .then(text => setSvgContent(text))
      .catch(err => console.error(`No se pudo cargar el icono ${name}:`, err))
  }, [name])

  const coloredSvg = useMemo(() => {
    if (!svgContent) return null
    return svgContent
      .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')
  }, [svgContent])

  if (!coloredSvg) return null

  return (
    <span
      className={`${styles.iconWrapper} ${className}`}
      style={{
        display: 'inline-block',
        width,
        height,
        color: color,
      }}
      dangerouslySetInnerHTML={{ __html: coloredSvg }}
      onMouseEnter={hoverColor ? e => (e.currentTarget.style.color = hoverColor) : undefined}
      onMouseLeave={hoverColor ? e => (e.currentTarget.style.color = color || 'currentColor') : undefined}
    />
  )
}
