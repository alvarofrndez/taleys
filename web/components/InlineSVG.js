import { useEffect, useState } from 'react'

export default function InlineSVG({ src, color = 'currentColor', className = '', style = {} }) {
    const [svgContent, setSvgContent] = useState('')

    const parseSize = (size) => {
        if (typeof size === 'string') return size.replace('px', '')
        return size
    }

    useEffect(() => {
        fetch(src)
        .then((res) => res.text())
        .then((text) => {
            setSvgContent(text)
        })
    }, [src])

    return (
        <span
            className={className}
            style={{
                color,
                display: 'inline-flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: parseSize(style.width) || 24,
                height: parseSize(style.height) || 24,
                stroke: color,
                ...style,
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
        />
    )
}
