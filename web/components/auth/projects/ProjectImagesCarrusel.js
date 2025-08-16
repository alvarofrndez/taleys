import { useState } from 'react'
import styles from '@/assets/auth/projects/image-carrusel.module.scss'
import Image from 'next/image'

export default function ProjectImagesCarousel({ images = [] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [zoomed, setZoomed] = useState(false)

    const prev = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
    }

    const next = () => {
        setCurrentIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
    }

    const zoomImage = () => {
        setZoomed(true)
    }

    const closeZoom = () => {
        setZoomed(false)
    }

    if (images.length === 0) return null

    return (
        <div className={styles.carousel}>
            <div className={styles.imageContainer}>
                <Image 
                    className={styles.imageZoom}
                    src={'/images/icons/expand.svg'}
                    alt='zoom'
                    width={15}
                    height={15}
                    onClick={zoomImage}
                />
                <img
                    className={styles.img}
                    src={images[currentIndex].url}
                    alt={`Slide ${currentIndex + 1}`}
                    onClick={zoomImage}
                />
            </div>

            <div className={styles.thumbnailRow}>
                {images.map((img, index) => (
                    <img
                        key={index}
                        src={img.url}
                        alt={`Thumbnail ${index + 1}`}
                        className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    />
                ))}
            </div>
            
            <div className={styles.controls}>
                <button onClick={prev}>⟨</button>
                <span>{currentIndex + 1} / {images.length}</span>
                <button onClick={next}>⟩</button>
            </div>

            {zoomed && (
                <div className={styles.zoomOverlay} onClick={closeZoom}>
                    <div className={styles.zoomedImage}>
                        <img src={images[currentIndex].url} alt='zoomed'  />
                    </div>
                </div>
            )}
        </div>
    )
}