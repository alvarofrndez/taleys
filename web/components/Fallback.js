import React from 'react'
import styles from '@/assets/global/fallback/fallback.module.scss'

const FALLBACK_CONFIGS = {
  modal: {
    containerClass: 'modalContainer',
    sections: [
      {
        type: 'header',
        className: 'header',
        elements: [
          { type: 'skeleton', variant: 'text', width: '200px', height: '24px' },
          { type: 'skeleton', variant: 'text', width: '300px', height: '16px' }
        ]
      },
      {
        type: 'content',
        className: 'content',
        elements: [
          {
            type: 'form',
            className: 'form',
            elements: [
              {
                type: 'formGroup',
                className: 'formGroup',
                repeat: 3,
                elements: [
                  { type: 'skeleton', variant: 'text', width: '80px', height: '14px' },
                  { type: 'skeleton', variant: 'input', width: '100%', height: '32px' }
                ]
              }
            ]
          }
        ]
      },
      {
        type: 'footer',
        className: 'footer',
        elements: [
          { type: 'skeleton', variant: 'button', width: '70px', height: '32px' },
          { type: 'skeleton', variant: 'button', width: '90px', height: '32px' }
        ]
      }
    ]
  },
  
  dialog: {
    containerClass: 'dialogContainer',
    sections: [
      {
        type: 'content',
        className: 'content',
        elements: [
          { type: 'skeleton', variant: 'text', width: '90%', height: '18px' },
          {
            type: 'buttonsContainer',
            className: 'buttonsContainer',
            elements: [
              { type: 'skeleton', variant: 'button', width: '80px', height: '32px' },
              { type: 'skeleton', variant: 'button', width: '70px', height: '32px' }
            ]
          }
        ]
      }
    ]
  },

  list: {
    containerClass: 'listContainer',
    sections: [
      {
        type: 'header',
        className: 'listHeader',
        elements: [
          { type: 'skeleton', variant: 'text', width: '150px', height: '20px' }
        ]
      },
      {
        type: 'content',
        className: 'listContent',
        elements: [
          {
            type: 'listItem',
            className: 'listItem',
            repeat: 5,
            elements: [
              { type: 'skeleton', variant: 'circle', width: '40px', height: '40px' },
              { type: 'skeleton', variant: 'text', width: '200px', height: '16px' },
              { type: 'skeleton', variant: 'text', width: '100px', height: '14px' }
            ]
          }
        ]
      }
    ]
  },

  card: {
    containerClass: 'cardContainer',
    sections: [
      {
        type: 'content',
        className: 'cardContent',
        elements: [
          { type: 'skeleton', variant: 'rectangle', width: '100%', height: '120px' },
          { type: 'skeleton', variant: 'text', width: '80%', height: '18px' },
          { type: 'skeleton', variant: 'text', width: '60%', height: '14px' }
        ]
      }
    ]
  }
}

// Componente individual de Skeleton
const SkeletonElement = ({ variant = 'text', width = '100%', height = '16px', className = '' }) => {
  const skeletonClass = `${styles.skeleton} ${styles[`skeleton-${variant}`]} ${className}`
  
  return (
    <div 
      className={skeletonClass}
      style={{ width, height }}
    />
  )
}

// Función recursiva para renderizar elementos
const renderElements = (elements, parentKey = '') => {
  return elements.map((element, index) => {
    const key = `${parentKey}-${index}`
    
    if (element.type === 'skeleton') {
      return (
        <SkeletonElement 
          key={key}
          variant={element.variant}
          width={element.width}
          height={element.height}
          className={element.className}
        />
      )
    }
    
    // Si tiene elementos anidados, crear un contenedor
    if (element.elements) {
      const Tag = element.tag || 'div'
      const repeatCount = element.repeat || 1
      
      if (repeatCount > 1) {
        return Array.from({ length: repeatCount }, (_, repeatIndex) => (
          <Tag key={`${key}-${repeatIndex}`} className={styles[element.className] || ''}>
            {renderElements(element.elements, `${key}-${repeatIndex}`)}
          </Tag>
        ))
      }
      
      return (
        <Tag key={key} className={styles[element.className] || ''}>
          {renderElements(element.elements, key)}
        </Tag>
      )
    }
    
    return null
  })
}

// Componente principal Fallback
const Fallback = ({ 
  type = 'modal', 
  config = null, 
  className = '', 
  customStyles = {} 
}) => {
  // Usar configuración personalizada o predefinida
  const fallbackConfig = config || FALLBACK_CONFIGS[type] || FALLBACK_CONFIGS.modal
  
  return (
    <div 
      className={`${styles[fallbackConfig.containerClass]} ${className}`}
      style={customStyles}
    >
      {fallbackConfig.sections.map((section, index) => {
        const Tag = section.tag || 'div'
        return (
          <Tag key={`section-${index}`} className={styles[section.className] || ''}>
            {renderElements(section.elements, `section-${index}`)}
          </Tag>
        )
      })}
    </div>
  )
}

export default Fallback