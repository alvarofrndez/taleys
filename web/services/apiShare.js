// src/services/shareService.js
import pushToast from '@/utils/pushToast'

export const apiShare = {
    share: async ({ title, text = '', url }) => {
        try {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title,
                        text,
                        url
                    })
                    return
                } catch (err) {
                    pushToast('Error al intentar compartir', 'error')
                }
            }

            const encodedURL = encodeURIComponent(url)
            const encodedTitle = encodeURIComponent(title)
            const encodedText = encodeURIComponent(text)

            const services = [
                {
                    name: 'WhatsApp',
                    url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedURL}`
                },
                {
                    name: 'Twitter',
                    url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedURL}`
                },
                {
                    name: 'LinkedIn',
                    url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedURL}&title=${encodedTitle}`
                },
                {
                    name: 'Facebook',
                    url: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`
                }
            ]

            const serviceNames = services.map(s => s.name).join('\n')
            const choice = prompt(`¿Dónde quieres compartir?\n${serviceNames}`)

            if (!choice) return

            const selected = services.find(
                s => s.name.toLowerCase() === choice.toLowerCase()
            )

            if (selected) {
                window.open(selected.url, '_blank', 'noopener,noreferrer')
            } else {
                try {
                    await navigator.clipboard.writeText(url)
                    pushToast('Enlace copiado al portapapeles 📋', 'success')
                } catch (err) {
                    pushToast('No se pudo copiar el enlace', 'error')
                }
            }
        } catch (err) {
            pushToast('Ocurrió un error al intentar compartir', 'error')
        }
    }
}
