import store from '@/stores/store'
import pushToast from '@/utils/pushToast'

export const apiCall = async (method, endpoint, body = undefined, token = undefined) => {
    const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`)
  
    let headers = {
        Accept: 'application/json',
    }

    if(!(body instanceof FormData)){
        headers['Content-Type'] = 'application/json'
    }

    const state = store.getState()
    token = token ? token : state.auth?.token

    if (token) {
        headers.Authorization = `Bearer ${token}`
    }
  
    const fetch_options = {
        method,
        headers,
        credentials: 'include',
        cache: 'no-store',
    }
  
    if (body && ['POST', 'PUT', 'DELETE'].includes(method)) {
        if(body != undefined && !(body instanceof FormData))
            fetch_options.body = JSON.stringify(body)
        else
            fetch_options.body = body
    }
  
    if(process.env.NEXT_PUBLIC_ENV == 'local'){
        console.log(method, endpoint, body, token)
    }

    try{
        const response = await fetch(url, fetch_options)

        if(!response.ok) return await validateResponse(response)
    
        const response_json = await response.json()

        if(process.env.NEXT_PUBLIC_ENV == 'local'){
            console.log(response)
        }
    
        return {
            status: response.status,
            ... response_json
        }
    }catch{
        pushToast('El servidor está caido, disculpe las molestias', 'error')
    }
    
}

const validateResponse = async (response) => {
    const response_json = await response.json()
    switch(response_json.error_code){
        case 'Unauthorized':{
            pushToast(response_json.message, 'error')
            return false
        }
        case 'Unauthenticated':{
            pushToast('Debes inicar sesión', 'error')
            return false
        }
        case 'MeUnauthenticated':{
            return false
        }
        case 'InternalError':{
            pushToast(response_json.message, 'error')
            return false
        }
        case 'TooManyRequest':{
            pushToast(response_json.message, 'error')
            return false
        }

        default:{
            pushToast(response_json.message, 'error')
            return {
                status: response.status,
                ... response_json
            }
        }
    }
}