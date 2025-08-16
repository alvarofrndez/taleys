import { apiCall } from '@/services/apiCall'
import { useEffect, useState } from 'react'

export default function ProjectProvidersSelect({onProviderSelect}) {
    const [providers, setProviders] = useState([])
    useEffect(() => {
        const getProviders = async () => {
            const response = await apiCall('GET', '/projectSiteProviders')
            
            if(response?.success){
                setProviders(response.data)
            }
        }
        getProviders()
    }, [])
    
    const handleChange = (e) => {
        const selected_provider = providers.find((provider) => provider.value == e.target.value)
        onProviderSelect(selected_provider)
    }

    return(
        <select onChange={handleChange}>
            <option value='' disabled selected>-- Selecciona un proveedor --</option>
            {providers.map((provider) => (
                <option value={provider.value} key={provider.value}>
                    {provider.label}
                </option>
            ))}
        </select>
    )
}