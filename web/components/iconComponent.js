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
  backgroundHoverColor,
  fill,
  onClick = null,
  disabled = false
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
      .replace(/stroke="[^"]*"/g, 'stroke="currentColor"')

    if (fill) {
      if (/fill="[^"]*"/.test(result)) {
        result = result.replace(/fill="[^"]*"/g, `fill="${fill}"`)
      }
    }

    return result
  }, [svgContent, fill])

  if (!coloredSvg) return null

  const handleClick = (e) => {
    if (disabled) return
    if (onClick) onClick(e)
  }

  const handleMouseEnter = (e) => {
    if (disabled) return
    if (hoverColor) e.currentTarget.style.color = hoverColor
    if (backgroundHoverColor) e.currentTarget.style.backgroundColor = backgroundHoverColor
  }

  const handleMouseLeave = (e) => {
    if (disabled) return
    if (hoverColor) e.currentTarget.style.color = ''
    if (backgroundHoverColor) e.currentTarget.style.backgroundColor = ''
  }

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
        stroke: color,
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer'
      }}
      dangerouslySetInnerHTML={{ __html: coloredSvg }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  )
}
