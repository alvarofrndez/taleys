import { apiCall } from '@/services/apiCall'
import { useEffect, useState } from 'react'
import styles from '@/assets/auth/projects/categories-select.module.scss'

export default function ProjectCategoriesSelect({onCategorySelect}) {
    const [categories, setCategories] = useState([])
    useEffect(() => {
        const getProviders = async () => {
            const response = await apiCall('GET', '/projectCategoryTypes')
            
            if(response?.success){
                setCategories(response.data)
            }
        }
        getProviders()
    }, [])

    const handleChange = (e) => {
        const selected_category = categories.find((category) => category.value == e.target.value)
        onCategorySelect(selected_category)
    }

    return(
        <select className={styles.select} onChange={handleChange}>
            <option value="" disabled selected>-- Selecciona una categoría --</option>
            {categories.map((category) => (
                <option value={category.value} key={category.value}>
                    {category.label}
                </option>
            ))}
        </select>
    )
}