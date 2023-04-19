import { createApi } from "unsplash-js";

const UNSPLASH_API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY


const unsplash = createApi({
    accessKey:UNSPLASH_API_KEY  
})

export default unsplash;