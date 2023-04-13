import Image from 'next/image'
import unsplash from '../lib/unsplash'
import { useEffect } from 'react'



export default function Home() {
  useEffect(()=>{
    unsplash.search
    .getPhotos({query:'dogs', perPage:10, page:1})
    .then((result)=>console.log(result.response?.results))
    .catch((error)=>console.log(error))
  }, [])
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
    </main>
  )
}
