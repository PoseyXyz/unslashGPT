import Image from 'next/image'
import unsplash from '../lib/unsplash'
import { ChangeEvent, useEffect, useState } from 'react'
import { GMB_KEYS } from '../data/supported-gmb-keys'
import { Configuration, OpenAIApi } from 'openai'
import { IoIosClose } from 'react-icons/io'
import { FaSearch } from 'react-icons/fa'


const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY



export default function Home() {

  const [keyArray] = useState(GMB_KEYS)
  const [selectedKey, setSelectedKey] = useState('')


  const [tempItemArray, setTempItemArray] = useState(keyArray)
  const [searchString, setSearchString] = useState<string>('')


  const [generatedKeywords, setGeneratedKeywords] = useState([])

  const [loading, setLoading] = useState(false)


  const onFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    setSearchString(e.target.value)
  }

  const searchList = () => {
    setTempItemArray(keyArray.filter(items => items.toLowerCase().match(searchString.toLowerCase())))
  }

  const saveCategorySelection = (selectedOption: string) => {
    setSelectedKey(selectedOption)
  }

  useEffect(() => {
    searchList()
  }, [searchString])


  const [imageResults, setImageResults] = useState([])

  function triggerImageLoad(searchKey) {
    unsplash.search
      .getPhotos({ query: searchKey, perPage: 12, page: 1 })
      .then((result) => setImageResults(result.response?.results))
      .catch((error) => console.log(error))
  }

  useEffect(() => {
    console.log(imageResults);
  }, [imageResults])
  //  useEffect(()=>{    
  //   unsplash.search
  //   .getPhotos({query:'dogs', perPage:10, page:1})
  //   .then((result)=>console.log(result.response?.results))
  //   .catch((error)=>console.log(error))
  // }, [])




  function airequestsender(gmb_key) {

    const configuration = new Configuration({
      organization: "org-yl3HActUjHpuNqtN5N4uoGRU",
      apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    async function runCompletion() {
      setLoading(true)

      let tempObject = []
      try {

        const completion = await openai.createChatCompletion({
          model: "gpt-3.5-turbo",
          messages: [
            { role: "user", content: `Suggest 10 search query texts for the Unsplash API to find images for the "header" section of a ${gmb_key} website. Return the search queries in a JSON array.` },
          ],
          max_tokens: 4000,
          temperature: 1.1
        });

        tempObject = completion.data.choices[0].message.content

      } catch (error) {
        console.log(error);
      }
      setLoading(false)
      setGeneratedKeywords(JSON.parse(tempObject.toString().replace(/^"(.*)"$/, '$1')))

    }
    runCompletion()
  }

  return (
    <main className="grid grid-cols-3 min-h-screen">
      {/* <select className='bg-red-500' value={selectedKey} onChange={(e) => setSelectedKey(e.target.value)} name="" id="">
        {keyArray.map(key => (
          <option value={key} key={key}>{key}</option>
        ))}
      </select> */}

      <section className='col-span-1 flex flex-col gap-12 py-24 px-8'>

        <div className="flex flex-col gap-6">
          <label htmlFor="Company name" className="text-xl">
            GMB Key
          </label>

          <div className='flex'>
            <article className='relative w-[85%]'>

              <div className={`${searchString === '' ? 'border border-r-0' : 'border border-b-0'} border-gray-400 flex gap-4`}>
                {/* <h1 className="text-xl">{searchString}</h1>
            <div className="grid grid-cols-3">
                {tempItemArray.map((item, index) => {
                    return (z
                        <p key={index} className="text-xl">{item}</p>
                    )
                })}
            </div> */}
                {
                  selectedKey === '' ? <input value={searchString} onChange={(e) => { onFormChange(e) }} className={`flex-auto hover:bg-gray-100 p-4 border-0 outline-none text-black`} placeholder='E.g. "Sushi restaurant" or "Hairdresser"' />
                    :
                    <button onClick={() => { setSelectedKey(''); setGeneratedKeywords([]) }} className="bg-[#EAEAEA] m-3 border-2 border-[#69AF24] py-3 px-5 flex justify-between min-w-[23%] items-center">{selectedKey} <i className="text-xl"><IoIosClose /></i></button>
                }
                {/* <div className="self-center px-4 flex-auto bg-gray-200 rounded-2xl">{selected}</div>  */}

              </div>
              <div className="overflow-scroll max-h-[20vh] absolute w-full"> {
                searchString === '' ? null :
                  <div className="flex flex-col gap-1 items-start bg-white border-gray-400 border w-full border-t-0">

                    {tempItemArray.map((item: string, index: number) => {
                      return (
                        <button onClick={() => { saveCategorySelection(item); setSearchString('') }} className="w-full" key={index}><li className="py-2 list-none block px-4 w-full text-left hover:bg-[#EBF5FF] hover:text-[#0078c8]">{item}</li></button>
                      )
                    })}
                  </div>
              }
              </div>
            </article>


            <button className='bg-[#D9D9D9] p-4 text-xl cursor-pointer' onClick={() => airequestsender(selectedKey)}><FaSearch /></button>

          </div>


        </div>

        <hr className='w-full' />

        {
          loading ? <h1 className='text-red-500'>Generating keyword results...</h1>
            :

            <article>
              <>
                {
                  generatedKeywords.length === 0
                    ?
                    <></>
                    :
                    <div className='flex gap-6 flex-col'>
                      <h3 className='text-xl'>GPT Suggested Keywords</h3>
                      <div className='flex flex-wrap gap-4'>
                        <>
                          {generatedKeywords.map(keyword => (<button className='underline text-lg text-blue-500 hover:text-blue-700 duration-500' onClick={() => triggerImageLoad(keyword)} key={keyword}>{keyword}</button>))}

                        </>
                      </div>
                    </div>
                }

              </>
            </article>
        }




      </section>

      <section className='col col-span-2 bg-gray-400' >
        <div className='grid grid-cols-4 gap-4'>
          {
            imageResults ? imageResults.map(result => (
              <div key={result.id} className='relative bg-red-500 overflow-hidden'>
                {/* <Image
                  alt="The guitarist in the concert."
                  src={result.urls.raw}
                  
                  className='object-cover top-0 left-0 absolute'
                /> */}
                <img src={result.urls.raw} className='w-full object-cover h-[400px]' alt="The guitarist in the concert." />
              </div>
            )) : <></>
          }
        </div>
      </section>

    </main>
  )
}
