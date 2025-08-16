'use client'

import styles from '@/assets/auth/projects/upload.module.scss'
import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import GlobalLoader from '@/components/GlobalLoader'
import UserAvatar from '@/components/auth/MeAvatar'
import Image from 'next/image'
import ProjectCategoriesSelect from '@/components/auth/projects/ProjectCategoriesSelect'
import ProjectProvidersSelect from '@/components/auth/projects/ProjectProvidersSelect'
import Loader from '@/components/Loader'
import pushToast from '@/utils/pushToast'
import UserMultiSelect from '@/components/UserMultiselect'
import { apiCall } from '@/services/apiCall'
import { useRouter } from 'next/navigation'

export default function PorjectUploadPage() {
    const router = useRouter()
    const user = useSelector((state) => state.auth.user)
    const [all_users, setAllUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [loading_upload, setLoadingUpload] = useState(false)
    const [section, setSection] = useState('details')
    const [form_data, setFormData] = useState({
        name: '',
        description: '',
        categories: [],
        tags: [],
        images: [],
        sites: [],
        videos: [],
        members: [],
        visibility: 'public',
        permit_comments: true,
        atribution: true
    })
    const [tag, setTag] = useState('')
    const [video, setVideo] = useState('')
    const [site, setSite] = useState({
        url: ''
    })
    const [provider, setProvider] = useState({
        value: '',
        label: ''
    })
    const [dragActive, setDragActive] = useState(false)

    useEffect(() => {
        const getAllUsers = async () => {
            const response = await apiCall('GET', '/users')

            if(response?.success){
                setAllUsers(response.data)
                
                // se añade al usuario logueado a los miembros
                if(!form_data.members.find((member) => member.id == user.id)){
                    let final_members = form_data.members
                    final_members.push(user)
                    setFormData({...form_data, members: final_members})
                }
            }

            setLoading(false)
        }

        getAllUsers()
    }, [])

    const handleCategorySelect = (cat) => {
        if(!cat.value){
            pushToast('Debe seleccionar una categoría', 'error')
            return false
        }

        for(let c of form_data.categories){
            if(c.value == cat.value) {
                pushToast('La categoría ya está añadida', 'error')
                return false
            }
        }

        setFormData(prev_data => ({
            ...prev_data,
            categories: [...prev_data.categories, cat]
        }))
    }

    const handleRemoveCategory = (index) => {
        setFormData(prev_data => ({
            ...prev_data,
            categories: prev_data.categories.filter((_, i) => i !== index)
        }))
    }

    const handleAddTag = () => {
        if(!tag){
            pushToast('Debe insertar una etiqueta', 'error')
            return false
        }

        for(let t of form_data.tags){
            if(t == tag) {
                pushToast('La etiqueta ya está añadida', 'error')
                return false
            }
        }

        setFormData(prev_data => ({
            ...prev_data,
            tags: [...prev_data.tags, tag]
        }))

        setTag('')
    }

    const handleRemoveTag = (index) => {
        setFormData(prev_data => ({
            ...prev_data,
            tags: prev_data.tags.filter((_, i) => i !== index)
        }))
    }

    const handleProviderSelect = (cat) => {
        setProvider(cat)
    }

    const handleAddSite = () => {
        if(!checkAddSiteData()) return

        setFormData(prev_data => ({
            ...prev_data,
            sites: [...prev_data.sites, {...site, provider: provider }]
        }))

        setSite({ url: '' })
        setProvider(null)
    }

    const handleRemoveSite = (index) => {
        setFormData(prev_data => ({
            ...prev_data,
            sites: prev_data.sites.filter((_, i) => i !== index)
        }))
    }

    const checkAddSiteData = () => {
        if (!site.url){
            pushToast('debe añadir una url', 'error')
            return false
        }

        if (!provider.value){
            pushToast('debe asignar un proveedor', 'error')
            return false
        }

        for(let s of form_data.sites){
            if(s.provider.value == provider.value) {
                pushToast('Proveedor del sitio ya configurado', 'error')
                return false
            }
            
            if(s.url == site.url) {
                pushToast('Sitio ya añadido', 'error')
                return false
            }
        }

        return true
    }

    const handleAddVideo = () => {
        if(!video){
            pushToast('Debe insertar una url para el video', 'error')
            return false
        }

        for(let v of form_data.videos){
            if(v == video) {
                pushToast('El video ya esá añadido', 'error')
                return false
            }
        }

        setFormData(prev_data => ({
            ...prev_data,
            videos: [...prev_data.videos, video]
        }))

        setVideo('')
    }

    const handleRemoveVideo = (index) => {
        setFormData(prev_data => ({
            ...prev_data,
            videos: prev_data.videos.filter((_, i) => i !== index)
        }))
    }

    const handleRemoveMember = (index) => {
        setFormData(prev_data => ({
            ...prev_data,
            members: prev_data.members.filter((_, i) => i !== index)
        }))
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setDragActive(true)
    }

    const handleDragLeave = () => {
        setDragActive(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setDragActive(false)
        const files = e.dataTransfer.files
        if (files && files.length > 0) {
            handleFiles(files)
        }
    }

    const handleFiles = (files) => {
        const images = Array.from(files).filter(file => file.type.startsWith('image/'))

        const images_objects = images.map(image => ({
            blob: URL.createObjectURL(image),
            file: image
        }))

        setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...images_objects]
        }))
    }

    const handleInputChange = (e) => {
        const files = e.target.files
        if (files && files.length > 0) {
            handleFiles(files)
        }
    }

    const onUpload = async () => {
        setLoadingUpload(true)

        const validation = checkUploadData()

        if (!validation.valid) {
            pushToast(validation.message, 'error')
            setLoadingUpload(false)
            return
        }

        const form = buildFormData()

        const response = await apiCall('POST', '/projects', form)

        if(response.success){
            router.push(`/projects/${response.data.name}?id=${response.data.id}`)
        }
        pushToast(response.message, response.success ? 'success' : 'error')

        setLoadingUpload(false)
    }

    const buildFormData = () => {
        const form = new FormData()
    
        form.append('name', form_data.name)
        form.append('description', form_data.description)
        form.append('visibility', form_data.visibility)
        form.append('permit_comments', form_data.permit_comments.toString())
        form.append('atribution', form_data.atribution.toString())
    
        appendArrayToForm(form, 'categories', form_data.categories)
        appendArrayToForm(form, 'tags', form_data.tags)
        appendArrayToForm(form, 'sites', form_data.sites)
        appendArrayToForm(form, 'videos', form_data.videos, false)
        appendArrayToForm(form, 'members', form_data.members)
    
        form_data.images.forEach((img, index) => {
            form.append('images', img.file)
        })

        return form
    }

    const appendArrayToForm = (form, key, array, stringify = true) => {
        if (array.length) {
            array.forEach(item =>
                form.append(`${key}[]`, stringify ? JSON.stringify(item) : item)
            )
        }
    }

    const checkUploadData = () => {
        const url_pattern = /^(https?:\/\/)?([\w\d-]+\.)+[\w-]{2,}(\/.*)?$/
    
        if (!form_data.name.trim()) return { valid: false, message: 'El nombre del proyecto es obligatorio' }
        if (!form_data.description.trim()) return { valid: false, message: 'La descripción del proyecto es obligatoria' }
        if (form_data.categories.length === 0) return { valid: false, message: 'Debe seleccionar al menos una categoría' }
        if (form_data.images.length === 0) return { valid: false, message: 'Debe subir al menos una imagen del proyecto' }
    
        if (form_data.sites.length > 0) {
            for (let site of form_data.sites) {
                console.log(site)
                if (!url_pattern.test(site.url)) {
                    return { valid: false, message: `El enlace proporcionado (${site.url}) no es válido` }
                }
                if (!site.provider || !site.provider.label) {
                    return { valid: false, message: 'Cada enlace debe tener un proveedor asociado' }
                }
            }
        }
    
        if (form_data.videos.length > 0) {
            for (let video of form_data.videos) {
                if (!url_pattern.test(video)) {
                    return { valid: false, message: `El enlace del video (${video}) no es válido` }
                }
            }
        }

        if (form_data.images.length + images_objects.length > 5) {
            return 'Solo puedes subir hasta 5 imágenes'
        }
    
        if (!['public', 'private'].includes(form_data.visibility)) {
            return { valid: false, message: `La visibilidad del proyecto debe ser 'public' o 'private'`}
        }

        return { valid: true, message: 'Los datos son válidos' }
    }

    if (loading)
        return <GlobalLoader />

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <ul className={styles.navList}>
                        <li className={section === 'details' ? styles.active : styles.navItem}>
                            <button onClick={() => setSection('details')}>Detalles</button>
                        </li>
                        <li className={section === 'multimedia' ? styles.active : styles.navItem}>
                            <button onClick={() => setSection('multimedia')}>Multimedia</button>
                        </li>
                        <li className={section === 'configuration' ? styles.active : styles.navItem}>
                            <button onClick={() => setSection('configuration')}>Configuración</button>
                        </li>
                    </ul>
                </nav>
                <button onClick={onUpload} className={styles.upload}>
                    {
                        loading_upload ? 
                            <Loader color={'foreground'} />
                        :
                            <span>Publicar</span>
                    }
                </button>
            </header>
            <section className={styles.section}>
                {
                    section === 'details' ?
                        <div className={styles.content}>
                            <header className={styles.contentHeader}>
                                <h2>Información del proyecto</h2>
                                <span>Proporciona los detalles básicos de tu proyecto</span>
                            </header>
                            <div className={styles.form}>
                                <div className={styles.formGroup}>
                                    <label>Nombre del proyecto <span>*</span></label>
                                    <input value={form_data.name} onChange={(e) => setFormData({ ...form_data, name: e.target.value })} type='text' placeholder='Nombre del proyecto' />
                                    <span className={styles.span}>Un título claro y descriptivo ayudará a que tu proyecto destaque</span>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Descripción <span>*</span></label>
                                    <textarea value={form_data.description} onChange={(e) => setFormData({ ...form_data, description: e.target.value })} type='text' placeholder='Descripción del proyecto' />
                                    <span className={styles.span}>Una buena descripción incluye el contexto, los objetivos y los resultados del proyecto</span>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Categorías <span>*</span></label>
                                    <div className={styles.formGroupInputs}>
                                        <ProjectCategoriesSelect className={styles.formGroupInputsCategories} onCategorySelect={handleCategorySelect}/>
                                    </div>
                                    {   form_data.categories.length == 0 &&
                                        <span className={styles.span}>Añade las categorías que aborda tu proyecto</span>
                                    }
                                    <div className={styles.formGroupList}>
                                        {
                                            form_data.categories.map((c, index) => {
                                                return(
                                                    <div className={styles.formGroupListItem} key={c.value}>
                                                        <label>{c.label}</label>
                                                        <div className={styles.formGroupListItemActions}>
                                                            <Image src={'/images/icons/cross.svg'} onClick={() => handleRemoveCategory(index)} alt='upload' width={15} height={15} />
                                                        </div>
                                                    </div>
                                                )
                                            })   
                                        }
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Etiquetas <span>*</span></label>
                                    <div className={styles.formGroupInputs}>
                                        <input value={tag} onChange={(e) => setTag(e.target.value)} type='text' placeholder='Tags del proyecto' />
                                        <button onClick={handleAddTag}>
                                            <Image src={'/images/icons/add.svg'} alt='upload' width={15} height={15} />
                                        </button>
                                    </div>
                                    {  form_data.tags.length == 0 &&
                                        <span className={styles.span}>Añade etiquetas para ayudar a clasificar tu proyecto</span>
                                    }
                                    <div className={styles.formGroupList}>
                                        {
                                            form_data.tags.map((t, index) => {
                                                return(
                                                    <div className={styles.formGroupListItem} key={t}>
                                                        <label>#{t}</label>
                                                        <div className={styles.formGroupListItemActions}>
                                                            <Image src={'/images/icons/cross.svg'} onClick={() => handleRemoveTag(index)} alt='upload' width={15} height={15} />
                                                        </div>
                                                    </div>
                                                )
                                            })  
                                        }
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Enlaces</label>
                                    <div className={styles.formGroupInputs}>
                                        <input value={site.url} onChange={(e) => setSite({...site, url: e.target.value})} type='text' placeholder='Enlaces del proyecto' />
                                        <ProjectProvidersSelect onProviderSelect={handleProviderSelect}/>
                                        <button onClick={handleAddSite}>
                                            <Image src={'/images/icons/add.svg'} alt='upload' width={15} height={15} />
                                        </button>
                                    </div>
                                    {
                                        form_data.sites.length == 0 &&
                                        <span className={styles.span}>Añade enlaces a recursos relacionados con tu proyecto</span>
                                    }
                                    <div className={styles.formGroupList}>
                                        {
                                            form_data.sites.map((s, index) => {
                                                return(
                                                    <div className={styles.formGroupListItem} key={s.provider.value}>
                                                        <label>{s.url} - {s.provider.label}</label>
                                                        <div className={styles.formGroupListItemActions}>
                                                            <Image src={'/images/icons/cross.svg'} onClick={() => handleRemoveSite(index)} alt='upload' width={15} height={15} />
                                                        </div>
                                                    </div>
                                                )
                                            })  
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    : section === 'multimedia' ?
                        <div className={styles.content}>
                            <header className={styles.contentHeader}>
                                <h2>Imágenes y contenido multimedia</h2>
                                <span>Sube imágenes, videos u otros archivos para mostrar tu proyecto</span>
                            </header>
                            <div className={styles.form}>
                                <div className={styles.img}>
                                    <div className={styles.imgHeader}>
                                        <label>Imágenes del Proyecto<span>*</span></label>
                                        <p>{form_data.images.length} / 5 imágenes</p>
                                    </div>
                                    <div className={styles.contentImg}
                                        onDragOver={handleDragOver}
                                        onDragLeave={handleDragLeave}
                                        onDrop={handleDrop}
                                        onClick={() => document.getElementById('fileInput').click()}
                                    >
                                        <input 
                                            id='fileInput'
                                            type='file' 
                                            hidden 
                                            accept='image/*'
                                            multiple
                                            onChange={handleInputChange} 
                                        />
                                        <div className={styles.inputContent}>
                                            <Image src={'/images/icons/image.svg'} alt='image' width={25} height={25}/>
                                            <h3>Arrastra y suelta tus imágenes aquí</h3>
                                            <span>O haz clic para seleccionar archivos. PNG, JPG, GIF hasta 5MB.</span>
                                            <button>Selecciona archivos</button>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                        <label>Video (opcional)</label>
                                        <div className={styles.formGroupInputs}>
                                            <input value={video} onChange={(e) => setVideo(e.target.value)} type='text' placeholder='URL del video (YouTube, Vimeo, etc.)' />
                                            <button onClick={handleAddVideo}>
                                                <Image src={'/images/icons/add.svg'} alt='upload' width={15} height={15} />
                                            </button>
                                        </div>
                                        {   form_data.videos.length == 0 &&
                                            <span className={styles.span}>Añade un video para mostrar tu proyecto en acción</span>
                                        }
                                        <div className={styles.formGroupList}>
                                            {
                                                form_data.videos.map((v, index) => {
                                                    return(
                                                        <div className={styles.formGroupListItem} key={v}>
                                                            <label>{v}</label>
                                                            <div className={styles.formGroupListItemActions}>
                                                                <Image src={'/images/icons/cross.svg'} onClick={() => handleRemoveVideo(index)} alt='upload' width={15} height={15} />
                                                            </div>
                                                        </div>
                                                    )
                                                })   
                                            }
                                        </div>
                                </div>
                            </div>
                        </div>
                    : section === 'configuration' ?
                        <div className={styles.content}>
                            <header className={styles.contentHeader}>
                                <h2>Configuración del Proyecto</h2>
                                <span>Configura la visibilidad y otras opciones para tu proyecto</span>
                            </header>
                            <div className={styles.config}>
                                <div className={styles.configItem}>
                                    <h3>Visibilidad</h3>
                                    <div className={styles.configItemVisibility}>
                                        <div className={styles.configItemVisibilityItem}>
                                            <Image src={'/images/icons/internet.svg'} alt='user' width={25} height={25} />
                                            <div>
                                                <p>Público</p>
                                                <span>Tu proyecto será visible para todos los usuarios de la plataforma</span>
                                            </div>
                                            <input 
                                                type='radio' 
                                                name='visibility'
                                                value='public' 
                                                checked={form_data.visibility === 'public'}
                                                onChange={(e) => setFormData({ ...form_data, visibility: e.target.value })}
                                            />
                                        </div>

                                        <div className={styles.configItemVisibilityItem}>
                                            <Image src={'/images/icons/lock.svg'} alt='user' width={25} height={25} />
                                            <div>
                                                <p>Privado</p>
                                                <span>Solo tú y los colaboradores que invites podrán ver el proyecto</span>
                                            </div>
                                            <input 
                                                type='radio' 
                                                name='visibility'
                                                value='private' 
                                                checked={form_data.visibility === 'private'}
                                                onChange={(e) => setFormData({ ...form_data, visibility: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.configItem}>
                                    <label>Miembros</label>
                                    <div className={styles.formGroupInputs}>
                                        <UserMultiSelect
                                            users={all_users}
                                            selected_users={form_data.members}
                                            onSelect={(selected) => setFormData({
                                                ...form_data,
                                                members: selected
                                            })}
                                        />
                                    </div>
                                    {  form_data.members.length == 0 &&
                                        <span className={styles.span}>Añade los miembros de tu proyecto</span>
                                    }
                                    <div className={styles.formGroupList}>
                                        {
                                            form_data.members.map((m, index) => {
                                                return(
                                                    <div className={styles.formGroupListItem} key={m.id}>
                                                        <label>{m.username}</label>
                                                        { m.id != user.id && 
                                                            <div className={styles.formGroupListItemActions}>
                                                                <Image src={'/images/icons/cross.svg'} onClick={() => handleRemoveMember(index)} alt='upload' width={15} height={15} />
                                                            </div>
                                                        }
                                                    </div>
                                                )
                                            })  
                                        }
                                    </div>
                                </div>
                                <div className={styles.configItem}>
                                    <label>Comentarios</label>
                                    <div className={styles.checkboxContainer}>
                                        <input 
                                            type='checkbox'
                                            checked={form_data.permit_comments}
                                            onChange={(e) => setFormData({ ...form_data, permit_comments: e.target.checked })}
                                        />
                                        <p>Permitir comentarios en este proyecto</p>
                                    </div>
                                    <span>Los usuarios podrán dejar comentarios y feedback en tu proyecto</span>
                                </div>
                                <div className={styles.configItem}>
                                    <label>Atribución</label>
                                    <div className={styles.checkboxContainer}>
                                        <input 
                                            type='checkbox' 
                                            value={form_data.atribution} 
                                            onChange={(e) => setFormData({ ...form_data, atribution: e.target.checked })}
                                        />
                                        <p>Requerir atribución al usar este proyecto</p>
                                    </div>
                                    <span>Los usuarios deberán darte crédito si utilizan o se inspiran en tu trabajo</span>
                                </div>
                            </div>
                        </div>
                    : null
                }

                <div className={styles.general}>
                    <aside className={styles.preview}>
                        <div className={styles.previewHeader}>
                            <h2>Vista previa</h2>
                            <span>Así se verá tu proyecto en la plataforma</span>
                        </div>
                        <div className={styles.previewImages}>
                            <img src={form_data.images[0]?.blob ?? '/images/placeholder.svg'} alt='Añadir imagenes para la vista previa'/>
                        </div>
                        <div className={styles.previewContent}>
                            <h3 className={styles.previewContentName}>{form_data.name || 'Nombre del proyecto'}</h3>
                            <div className={styles.previewContentUser}>
                                <UserAvatar />
                                <span>{user.name}</span>
                            </div>
                            <p className={styles.previewContentDescription}>{form_data.description|| 'Descripción del proyecto'}</p>
                        </div>

                        <div className={styles.previewLists}>
                            <div className={styles.listCategories}>
                                {
                                    form_data.categories.map((c, index) => {
                                        return(
                                            <div className={styles.listCategoriesItem} key={c.value}>
                                                <label>{c.label}</label>
                                            </div>
                                        )
                                    })   
                                }
                            </div>
                            <div className={styles.listTags}>
                                {
                                    form_data.tags.map((t, index) => {
                                        return(
                                            <div className={styles.listTagsItem} key={t}>
                                                <label>#{t}</label>
                                            </div>
                                        )
                                    })  
                                }
                            </div>
                        </div>

                        <div className={styles.previewInfo}>
                            <div className={styles.previewVisuals}>
                                <div className={styles.previewVisualsItem}>
                                    <Image src={'/images/icons/like.svg'} alt='user' width={15} height={15} />
                                    <span>0</span>
                                </div>
                                <div className={styles.previewVisualsItem}>
                                    <Image src={'/images/icons/like.svg'} alt='user' width={15} height={15} />
                                    <span>0</span>
                                </div>
                            </div>
                            <span>{ form_data.visibility == 'public' ? 'público' : 'privado'}</span>
                        </div>
                    </aside>
                    <aside className={styles.info}>
                        <header className={styles.headerInfo}>
                            <Image src={'/images/icons/tag.svg'} alt='user' width={15} height={15} />
                            <h3>Consejos para destacar</h3>
                        </header>
                        <ul className={styles.contentInfo}>
                            <li>Usa imágenes de alta calidad para mostrar tu trabajo</li>
                            <li>Escribe una descripción detallada del proceso</li>
                            <li>Incluye los desafíos y cómo los resolviste</li>
                            <li>Añade enlaces a recursos relacionados</li>
                            <li>Usa etiquetas relevantes para mejorar la visibilidad</li>
                        </ul>
                    </aside>
                </div>
            </section>
        </div>
    )
}