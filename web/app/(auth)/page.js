'use client'

import { apiCall } from '@/services/apiCall'

export default function Home() {
  const api = async () => {
    const response = await apiCall('GET', '/features')

    if(response){
      console.log(response)
    }
  }

  return (
    <div>
      <button onClick={api}>peticion</button>
    </div>
  )
}
